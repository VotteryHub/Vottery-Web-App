import { supabase } from "../lib/supabase";

const parseCsvRows = (csvText) => {
  const lines = (csvText || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim());
    return headers.reduce((acc, header, idx) => {
      acc[header] = cols[idx] || "";
      return acc;
    }, {});
  });
};

const normalizeProvider = (provider = "") => provider.trim().toLowerCase();

const extractDomain = (value = "") => {
  const input = value.trim();
  if (!input) return "";
  if (input.includes("@")) return input.split("@").pop() || "";
  try {
    const url = new URL(input.startsWith("http") ? input : `https://${input}`);
    return url.hostname || "";
  } catch {
    return input.replace(/^https?:\/\//, "").split("/")[0];
  }
};

export const enterpriseOperationsService = {
  async initiateEnterpriseSso({ tenantId, provider, issuer }) {
    const normalized = normalizeProvider(provider);
    const redirectTo = `${window.location.origin}/auth/callback?tenantId=${encodeURIComponent(
      tenantId || ""
    )}&provider=${encodeURIComponent(normalized)}`;

    if (["google", "google_workspace", "facebook", "apple"].includes(normalized)) {
      const oauthProviderMap = {
        google: "google",
        google_workspace: "google",
        facebook: "facebook",
        apple: "apple",
      };
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: oauthProviderMap[normalized],
        options: {
          redirectTo,
          queryParams: { tenant_id: tenantId || "", provider: normalized },
        },
      });
      return { data, error };
    }

    if (["okta", "saml", "saml2", "azure", "azure_ad"].includes(normalized)) {
      const domain = extractDomain(issuer);
      if (!domain) {
        return { data: null, error: { message: "Issuer/domain is required for enterprise SSO providers." } };
      }
      const { data, error } = await supabase.auth.signInWithSSO({
        domain,
        options: { redirectTo },
      });
      return { data, error };
    }

    return { data: null, error: { message: `Unsupported SSO provider: ${provider}` } };
  },

  async getWhiteLabelConfig(tenantId) {
    const { data, error } = await supabase
      .from("enterprise_branding_configs")
      .select("*")
      .eq("tenant_id", tenantId)
      .maybeSingle();
    return { data, error };
  },

  async saveWhiteLabelConfig(payload) {
    const { data, error } = await supabase
      .from("enterprise_branding_configs")
      .upsert(payload, { onConflict: "tenant_id" })
      .select()
      .single();
    return { data, error };
  },

  async getSsoConfig(tenantId) {
    const { data, error } = await supabase
      .from("enterprise_sso_configs")
      .select("*")
      .eq("tenant_id", tenantId)
      .maybeSingle();
    return { data, error };
  },

  async saveSsoConfig(payload) {
    const { data, error } = await supabase
      .from("enterprise_sso_configs")
      .upsert(payload, { onConflict: "tenant_id" })
      .select()
      .single();
    return { data, error };
  },

  async createBulkElectionsFromCsv({ csvText, createdBy, defaults = {} }) {
    const rows = parseCsvRows(csvText);
    if (!rows.length) {
      return { data: null, error: { message: "CSV has no data rows" } };
    }

    const elections = rows.map((row) => ({
      title: row.title || row.name || "Untitled Election",
      description: row.description || "",
      status: "draft",
      created_by: createdBy,
      starts_at: row.starts_at || defaults.startsAt || null,
      ends_at: row.ends_at || defaults.endsAt || null,
      category: row.category || defaults.category || "general",
    }));

    const { data, error } = await supabase
      .from("elections")
      .insert(elections)
      .select("id, title, status");
    return { data, error };
  },

  async saveVolumePricing(payload) {
    const { data, error } = await supabase
      .from("enterprise_pricing_models")
      .upsert(payload, { onConflict: "tenant_id" })
      .select()
      .single();
    return { data, error };
  },

  async sendWhatsAppNotification({ to, message, templateName = null }) {
    const { data, error } = await supabase.functions.invoke(
      "send-whatsapp-notification",
      {
        body: {
          to,
          message,
          templateName,
          channel: "whatsapp",
          // Keep global comms strategy explicit: SMS = Telnyx primary, Twilio fallback.
          smsProviderStrategy: "telnyx_primary_twilio_fallback",
        },
      }
    );
    return { data, error };
  },
};

