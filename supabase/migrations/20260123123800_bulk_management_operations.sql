-- Bulk Management Operations Migration
-- Supports bulk processing of elections, users, and compliance submissions
-- with progress tracking and automated rollback capabilities

-- Create bulk operation types enum
CREATE TYPE public.bulk_operation_type AS ENUM (
    'election_approval',
    'election_rejection',
    'user_suspension',
    'user_activation',
    'compliance_submission',
    'data_export',
    'batch_update'
);

CREATE TYPE public.bulk_operation_status AS ENUM (
    'pending',
    'processing',
    'completed',
    'failed',
    'rolled_back',
    'partially_completed'
);

-- Create bulk operations table
CREATE TABLE public.bulk_operations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    operation_name TEXT NOT NULL,
    operation_type public.bulk_operation_type NOT NULL,
    status public.bulk_operation_status DEFAULT 'pending'::public.bulk_operation_status,
    total_items INTEGER DEFAULT 0,
    processed_items INTEGER DEFAULT 0,
    successful_items INTEGER DEFAULT 0,
    failed_items INTEGER DEFAULT 0,
    progress_percentage NUMERIC(5,2) DEFAULT 0.00,
    target_entity_type TEXT NOT NULL,
    target_entity_ids JSONB DEFAULT '[]'::jsonb,
    operation_config JSONB DEFAULT '{}'::jsonb,
    batch_size INTEGER DEFAULT 50,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    estimated_completion TIMESTAMPTZ,
    rollback_enabled BOOLEAN DEFAULT true,
    rollback_data JSONB DEFAULT '{}'::jsonb,
    error_log JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bulk_operations_status ON public.bulk_operations(status);
CREATE INDEX idx_bulk_operations_type ON public.bulk_operations(operation_type);
CREATE INDEX idx_bulk_operations_created_by ON public.bulk_operations(created_by);
CREATE INDEX idx_bulk_operations_created_at ON public.bulk_operations(created_at DESC);

-- Create bulk operation items table for detailed tracking
CREATE TABLE public.bulk_operation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulk_operation_id UUID REFERENCES public.bulk_operations(id) ON DELETE CASCADE,
    entity_id UUID NOT NULL,
    entity_type TEXT NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'rolled_back')),
    before_state JSONB,
    after_state JSONB,
    error_message TEXT,
    processed_at TIMESTAMPTZ,
    rollback_executed BOOLEAN DEFAULT false,
    rollback_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bulk_operation_items_bulk_id ON public.bulk_operation_items(bulk_operation_id);
CREATE INDEX idx_bulk_operation_items_entity_id ON public.bulk_operation_items(entity_id);
CREATE INDEX idx_bulk_operation_items_status ON public.bulk_operation_items(status);

-- Create bulk operation logs table
CREATE TABLE public.bulk_operation_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bulk_operation_id UUID REFERENCES public.bulk_operations(id) ON DELETE CASCADE,
    log_level TEXT DEFAULT 'info' CHECK (log_level IN ('debug', 'info', 'warning', 'error', 'critical')),
    message TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bulk_operation_logs_bulk_id ON public.bulk_operation_logs(bulk_operation_id);
CREATE INDEX idx_bulk_operation_logs_level ON public.bulk_operation_logs(log_level);
CREATE INDEX idx_bulk_operation_logs_created_at ON public.bulk_operation_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.bulk_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_operation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_operation_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "admin_full_access_bulk_operations"
ON public.bulk_operations
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

CREATE POLICY "users_view_own_bulk_operations"
ON public.bulk_operations
FOR SELECT
TO authenticated
USING (created_by = auth.uid());

CREATE POLICY "admin_full_access_bulk_operation_items"
ON public.bulk_operation_items
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

CREATE POLICY "admin_full_access_bulk_operation_logs"
ON public.bulk_operation_logs
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() AND up.role = 'admin'
    )
);

DO $$
BEGIN
  RAISE NOTICE 'Bulk management operations tables created successfully';
END $$;