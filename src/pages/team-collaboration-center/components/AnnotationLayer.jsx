import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, X, Check, Trash2, Clock } from 'lucide-react';
import { supabase } from '../../../lib/supabase';

const ANNOTATION_COLORS = [
  { id: 'blue', label: 'Info', class: 'bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400' },
  { id: 'green', label: 'Positive', class: 'bg-green-500/10 border-green-500/30 text-green-600 dark:text-green-400' },
  { id: 'yellow', label: 'Warning', class: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-600 dark:text-yellow-400' },
  { id: 'red', label: 'Critical', class: 'bg-red-500/10 border-red-500/30 text-red-600 dark:text-red-400' },
];

const AnnotationLayer = ({ chartId, chartTitle }) => {
  const [annotations, setAnnotations] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ text: '', color: 'blue', category: 'insight' });
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadAnnotations();
    getCurrentUser();
  }, [chartId]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase?.auth?.getUser();
      setCurrentUser(user);
    } catch (e) {}
  };

  const loadAnnotations = async () => {
    try {
      // Try to load from Supabase activity_feed as annotation storage
      const { data } = await supabase
        ?.from('activity_feed')
        ?.select('*')
        ?.eq('activity_type', 'chart_annotation')
        ?.contains('metadata', { chartId })
        ?.order('created_at', { ascending: false })
        ?.limit(20);

      if (data && data?.length > 0) {
        setAnnotations(data?.map(d => ({
          id: d?.id,
          text: d?.metadata?.text || d?.content,
          color: d?.metadata?.color || 'blue',
          category: d?.metadata?.category || 'insight',
          author: d?.metadata?.author || 'Team Member',
          createdAt: d?.created_at,
          resolved: d?.metadata?.resolved || false,
        })));
      } else {
        // Fallback demo annotations
        setAnnotations([
          { id: '1', text: 'Revenue spike correlates with the new creator onboarding campaign launched on Feb 15.', color: 'green', category: 'insight', author: 'Analytics Team', createdAt: new Date(Date.now() - 86400000)?.toISOString(), resolved: false },
          { id: '2', text: 'Anomaly detected: 23% drop in engagement on Feb 20. Investigate potential UI change impact.', color: 'yellow', category: 'investigation', author: 'Product Team', createdAt: new Date(Date.now() - 43200000)?.toISOString(), resolved: false },
        ]);
      }
    } catch (e) {
      setAnnotations([
        { id: '1', text: 'Revenue spike correlates with the new creator onboarding campaign.', color: 'green', category: 'insight', author: 'Analytics Team', createdAt: new Date(Date.now() - 86400000)?.toISOString(), resolved: false },
      ]);
    }
  };

  const addAnnotation = async () => {
    if (!formData?.text?.trim()) return;
    setLoading(true);
    try {
      const annotation = {
        id: `ann_${Date.now()}`,
        text: formData?.text,
        color: formData?.color,
        category: formData?.category,
        author: currentUser?.email?.split('@')?.[0] || 'Team Member',
        createdAt: new Date()?.toISOString(),
        resolved: false,
      };

      // Try to persist to Supabase
      try {
        await supabase?.from('activity_feed')?.insert({
          activity_type: 'chart_annotation',
          content: formData?.text,
          metadata: { chartId, chartTitle, ...annotation },
          user_id: currentUser?.id,
        });
      } catch (e) {}

      setAnnotations(prev => [annotation, ...prev]);
      setFormData({ text: '', color: 'blue', category: 'insight' });
      setShowForm(false);
    } finally {
      setLoading(false);
    }
  };

  const resolveAnnotation = (id) => {
    setAnnotations(prev => prev?.map(a => a?.id === id ? { ...a, resolved: !a?.resolved } : a));
  };

  const deleteAnnotation = (id) => {
    setAnnotations(prev => prev?.filter(a => a?.id !== id));
  };

  const getColorClass = (colorId) => ANNOTATION_COLORS?.find(c => c?.id === colorId)?.class || ANNOTATION_COLORS?.[0]?.class;

  return (
    <div className="mt-4 border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-primary" />
          <span className="text-sm font-semibold text-foreground">Annotations</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
            {annotations?.filter(a => !a?.resolved)?.length} active
          </span>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Plus size={12} /> Add Note
        </button>
      </div>
      {/* Add Annotation Form */}
      {showForm && (
        <div className="p-4 bg-muted/20 border-b border-border">
          <textarea
            value={formData?.text}
            onChange={e => setFormData(prev => ({ ...prev, text: e?.target?.value }))}
            placeholder="Add your insight, decision note, or observation..."
            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 mb-3"
            rows={3}
          />
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-muted-foreground">Type:</span>
            <div className="flex gap-2">
              {ANNOTATION_COLORS?.map(c => (
                <button
                  key={c?.id}
                  onClick={() => setFormData(prev => ({ ...prev, color: c?.id }))}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    formData?.color === c?.id ? c?.class + ' ring-2 ring-offset-1 ring-primary' : c?.class
                  }`}
                >
                  {c?.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={addAnnotation}
              disabled={loading || !formData?.text?.trim()}
              className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Check size={12} /> Save
            </button>
            <button
              onClick={() => { setShowForm(false); setFormData({ text: '', color: 'blue', category: 'insight' }); }}
              className="flex items-center gap-1.5 bg-muted text-muted-foreground text-xs px-4 py-2 rounded-lg hover:bg-muted/80 transition-colors"
            >
              <X size={12} /> Cancel
            </button>
          </div>
        </div>
      )}
      {/* Annotations List */}
      <div className="divide-y divide-border max-h-80 overflow-y-auto">
        {annotations?.length === 0 ? (
          <div className="px-4 py-6 text-center">
            <MessageSquare size={24} className="text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No annotations yet. Add the first insight!</p>
          </div>
        ) : annotations?.map((annotation) => (
          <div key={annotation?.id} className={`px-4 py-3 ${annotation?.resolved ? 'opacity-50' : ''}`}>
            <div className="flex items-start gap-3">
              <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                annotation?.color === 'green' ? 'bg-green-500' :
                annotation?.color === 'yellow' ? 'bg-yellow-500' :
                annotation?.color === 'red' ? 'bg-red-500' : 'bg-blue-500'
              }`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm text-foreground ${annotation?.resolved ? 'line-through' : ''}`}>
                  {annotation?.text}
                </p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs text-muted-foreground font-medium">{annotation?.author}</span>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock size={10} />
                    {new Date(annotation.createdAt)?.toLocaleDateString()}
                  </span>
                  <span className={`text-xs px-1.5 py-0.5 rounded-full border ${getColorClass(annotation?.color)}`}>
                    {ANNOTATION_COLORS?.find(c => c?.id === annotation?.color)?.label}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => resolveAnnotation(annotation?.id)}
                  className={`p-1.5 rounded-lg transition-colors ${
                    annotation?.resolved ? 'text-green-500 bg-green-500/10' : 'text-muted-foreground hover:text-green-500 hover:bg-green-500/10'
                  }`}
                  title={annotation?.resolved ? 'Unresolve' : 'Mark resolved'}
                >
                  <Check size={12} />
                </button>
                <button
                  onClick={() => deleteAnnotation(annotation?.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnotationLayer;