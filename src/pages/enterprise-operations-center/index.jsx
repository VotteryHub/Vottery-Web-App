import React, { useMemo, useState } from "react";
import { Helmet } from "react-helmet";
import HeaderNavigation from "../../components/ui/HeaderNavigation";
import { enterpriseOperationsService } from "../../services/enterpriseOperationsService";
import { supabase } from "../../lib/supabase";

const TABS = [
  { id: "whiteLabel", label: "White-Label" },
  { id: "sso", label: "Enterprise SSO" },
  { id: "bulkElection", label: "Bulk Election Creation" },
  { id: "pricing", label: "Volume Pricing" },
  { id: "whatsapp", label: "WhatsApp Notifications" },
];

const SSO_PROVIDER_OPTIONS = ["okta", "azure_ad", "saml2", "google", "google_workspace", "facebook", "apple"];

const normalizeProvider = (provider = "") => provider.trim().toLowerCase();

export default function EnterpriseOperationsCenter() {
  const [activeTab, setActiveTab] = useState("whiteLabel");
  const [status, setStatus] = useState("");
  const [working, setWorking] = useState(false);
  const [tenantId, setTenantId] = useState("default-enterprise-tenant");
  const [whiteLabel, setWhiteLabel] = useState({
    customDomain: "",
    brandName: "Vottery Enterprise",
    primaryColor: "#4f46e5",
    hideVotteryBranding: true,
  });
  const [sso, setSso] = useState({
    provider: "okta",
    clientId: "",
    issuer: "",
    samlEntryPoint: "",
    enabled: true,
  });
  const [csvText, setCsvText] = useState("title,description,category\nQ2 Board Vote,Quarterly board decision,governance");
  const [bulkResult, setBulkResult] = useState(null);
  const [pricing, setPricing] = useState({
    participationDiscountPercent: 0,
    bulkVpDiscountPercent: 0,
    flatFeeUnlimitedElections: 0,
    licenseTerms: "",
  });
  const [whatsApp, setWhatsApp] = useState({ to: "", message: "" });

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const provider = params.get("provider");
    const issuer = params.get("issuer");
    if (provider || issuer) {
      setSso((prev) => ({
        ...prev,
        provider: normalizeProvider(provider || prev.provider),
        issuer: issuer || prev.issuer,
      }));
    }
  }, []);

  const statusClass = useMemo(
    () =>
      status.toLowerCase().includes("failed")
        ? "text-red-400"
        : status
          ? "text-emerald-400"
          : "text-muted-foreground",
    [status]
  );

  const runSafely = async (runner) => {
    setWorking(true);
    setStatus("");
    try {
      await runner();
    } catch (error) {
      setStatus(`Failed: ${error.message || "Unknown error"}`);
    } finally {
      setWorking(false);
    }
  };

  const validateSsoInputs = ({ provider, issuer }) => {
    const normalized = normalizeProvider(provider);
    if (!normalized) return "SSO provider is required.";
    if (!SSO_PROVIDER_OPTIONS.includes(normalized)) {
      return `Unsupported provider "${provider}". Allowed: ${SSO_PROVIDER_OPTIONS.join(", ")}.`;
    }
    if (["okta", "azure_ad", "saml2"].includes(normalized) && !issuer.trim()) {
      return `Issuer/domain is required for ${normalized}.`;
    }
    return "";
  };

  const saveWhiteLabel = () =>
    runSafely(async () => {
      const { error } = await enterpriseOperationsService.saveWhiteLabelConfig({
        tenant_id: tenantId,
        custom_domain: whiteLabel.customDomain,
        brand_name: whiteLabel.brandName,
        primary_color: whiteLabel.primaryColor,
        hide_vottery_branding: whiteLabel.hideVotteryBranding,
      });
      if (error) throw error;
      setStatus("White-label configuration saved.");
    });

  const saveSso = () =>
    runSafely(async () => {
      const validationError = validateSsoInputs(sso);
      if (validationError) {
        setStatus(`Failed: ${validationError}`);
        return;
      }
      const { error } = await enterpriseOperationsService.saveSsoConfig({
        tenant_id: tenantId,
        provider: normalizeProvider(sso.provider),
        client_id: sso.clientId,
        issuer: sso.issuer.trim(),
        saml_entry_point: sso.samlEntryPoint,
        enabled: sso.enabled,
      });
      if (error) throw error;
      setStatus("Enterprise SSO settings saved.");
    });

  const startSsoSignIn = () =>
    runSafely(async () => {
      const validationError = validateSsoInputs(sso);
      if (validationError) {
        setStatus(`Failed: ${validationError}`);
        return;
      }
      const { error } = await enterpriseOperationsService.initiateEnterpriseSso({
        tenantId,
        provider: normalizeProvider(sso.provider),
        issuer: sso.issuer.trim(),
      });
      if (error) throw error;
      setStatus("Redirecting to enterprise SSO provider...");
    });

  const createBulkElections = () =>
    runSafely(async () => {
      const { data: authData } = await supabase.auth.getUser();
      const createdBy = authData?.user?.id;
      if (!createdBy) {
        setStatus("Failed: authenticate first before bulk election creation.");
        return;
      }
      const { data, error } = await enterpriseOperationsService.createBulkElectionsFromCsv({
        csvText,
        createdBy,
      });
      if (error) throw error;
      setBulkResult(data || []);
      setStatus(`Created ${data?.length || 0} elections.`);
    });

  const savePricing = () =>
    runSafely(async () => {
      const { error } = await enterpriseOperationsService.saveVolumePricing({
        tenant_id: tenantId,
        participation_discount_percent: pricing.participationDiscountPercent,
        bulk_vp_discount_percent: pricing.bulkVpDiscountPercent,
        flat_fee_unlimited_elections: pricing.flatFeeUnlimitedElections,
        license_terms: pricing.licenseTerms,
      });
      if (error) throw error;
      setStatus("Volume pricing and license model saved.");
    });

  const sendWhatsApp = () =>
    runSafely(async () => {
      const { error } = await enterpriseOperationsService.sendWhatsAppNotification(whatsApp);
      if (error) throw error;
      setStatus("WhatsApp notification dispatched via Twilio.");
    });

  return (
    <>
      <Helmet>
        <title>Enterprise Operations Center - Vottery</title>
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-foreground">Enterprise Operations Center</h1>
          <p className="mt-2 text-muted-foreground">
            White-label, SSO, bulk election creation, pricing/licensing, and WhatsApp delivery.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm ${activeTab === tab.id ? "bg-primary text-white" : "bg-card border border-border text-foreground"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="mt-4 p-4 bg-card border border-border rounded-lg">
            <label className="block text-sm text-muted-foreground mb-1">Tenant ID</label>
            <input
              className="w-full px-3 py-2 rounded bg-muted text-foreground"
              value={tenantId}
              onChange={(e) => setTenantId(e.target.value)}
            />
          </div>

          {activeTab === "whiteLabel" && (
            <section className="mt-4 p-4 bg-card border border-border rounded-lg space-y-3">
              <input className="w-full px-3 py-2 rounded bg-muted" placeholder="Custom domain" value={whiteLabel.customDomain} onChange={(e) => setWhiteLabel({ ...whiteLabel, customDomain: e.target.value })} />
              <input className="w-full px-3 py-2 rounded bg-muted" placeholder="Brand name" value={whiteLabel.brandName} onChange={(e) => setWhiteLabel({ ...whiteLabel, brandName: e.target.value })} />
              <input className="w-full px-3 py-2 rounded bg-muted" placeholder="Primary color" value={whiteLabel.primaryColor} onChange={(e) => setWhiteLabel({ ...whiteLabel, primaryColor: e.target.value })} />
              <button disabled={working} onClick={saveWhiteLabel} className="px-4 py-2 rounded bg-primary text-white">Save White-Label Config</button>
            </section>
          )}

          {activeTab === "sso" && (
            <section className="mt-4 p-4 bg-card border border-border rounded-lg space-y-3">
              <select className="w-full px-3 py-2 rounded bg-muted" value={normalizeProvider(sso.provider)} onChange={(e) => setSso({ ...sso, provider: normalizeProvider(e.target.value) })}>
                {SSO_PROVIDER_OPTIONS.map((provider) => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
              <input className="w-full px-3 py-2 rounded bg-muted" placeholder="Client ID" value={sso.clientId} onChange={(e) => setSso({ ...sso, clientId: e.target.value })} />
              <input className="w-full px-3 py-2 rounded bg-muted" placeholder="Issuer URL" value={sso.issuer} onChange={(e) => setSso({ ...sso, issuer: e.target.value })} />
              <input className="w-full px-3 py-2 rounded bg-muted" placeholder="SAML entry point" value={sso.samlEntryPoint} onChange={(e) => setSso({ ...sso, samlEntryPoint: e.target.value })} />
              <div className="flex gap-2">
                <button disabled={working} onClick={saveSso} className="px-4 py-2 rounded bg-primary text-white">Save SSO Config</button>
                <button disabled={working} onClick={startSsoSignIn} className="px-4 py-2 rounded bg-indigo-700 text-white">Test SSO Sign-In</button>
              </div>
            </section>
          )}

          {activeTab === "bulkElection" && (
            <section className="mt-4 p-4 bg-card border border-border rounded-lg space-y-3">
              <textarea className="w-full min-h-[180px] px-3 py-2 rounded bg-muted" value={csvText} onChange={(e) => setCsvText(e.target.value)} />
              <button disabled={working} onClick={createBulkElections} className="px-4 py-2 rounded bg-primary text-white">Create Elections from CSV</button>
              {bulkResult && (
                <div className="text-sm text-muted-foreground">Last run created {bulkResult.length} elections.</div>
              )}
            </section>
          )}

          {activeTab === "pricing" && (
            <section className="mt-4 p-4 bg-card border border-border rounded-lg space-y-3">
              <input type="number" className="w-full px-3 py-2 rounded bg-muted" placeholder="Participation discount %" value={pricing.participationDiscountPercent} onChange={(e) => setPricing({ ...pricing, participationDiscountPercent: Number(e.target.value) })} />
              <input type="number" className="w-full px-3 py-2 rounded bg-muted" placeholder="Bulk VP discount %" value={pricing.bulkVpDiscountPercent} onChange={(e) => setPricing({ ...pricing, bulkVpDiscountPercent: Number(e.target.value) })} />
              <input type="number" className="w-full px-3 py-2 rounded bg-muted" placeholder="Flat fee for unlimited elections" value={pricing.flatFeeUnlimitedElections} onChange={(e) => setPricing({ ...pricing, flatFeeUnlimitedElections: Number(e.target.value) })} />
              <textarea className="w-full min-h-[100px] px-3 py-2 rounded bg-muted" placeholder="License terms" value={pricing.licenseTerms} onChange={(e) => setPricing({ ...pricing, licenseTerms: e.target.value })} />
              <button disabled={working} onClick={savePricing} className="px-4 py-2 rounded bg-primary text-white">Save Pricing Model</button>
            </section>
          )}

          {activeTab === "whatsapp" && (
            <section className="mt-4 p-4 bg-card border border-border rounded-lg space-y-3">
              <input className="w-full px-3 py-2 rounded bg-muted" placeholder="E.164 phone (e.g. +234...)" value={whatsApp.to} onChange={(e) => setWhatsApp({ ...whatsApp, to: e.target.value })} />
              <textarea className="w-full min-h-[100px] px-3 py-2 rounded bg-muted" placeholder="Message" value={whatsApp.message} onChange={(e) => setWhatsApp({ ...whatsApp, message: e.target.value })} />
              <button disabled={working} onClick={sendWhatsApp} className="px-4 py-2 rounded bg-primary text-white">Send WhatsApp Notification</button>
            </section>
          )}

          <p className={`mt-4 text-sm ${statusClass}`}>{status || "No operation run yet."}</p>
        </main>
      </div>
    </>
  );
}

