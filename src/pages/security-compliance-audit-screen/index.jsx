import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import LeftSidebar from '../../components/ui/LeftSidebar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

const CATEGORY_LABELS = {
  encryption: 'Encryption',
  authentication: 'Authentication',
  gdpr_ccpa: 'GDPR / CCPA',
  penetration_testing: 'Penetration Testing',
  data_residency: 'Data Residency',
  pre_launch: 'Pre-Launch Sign-Off',
};

const STATUS_CONFIG = {
  pass: { label: 'Pass', color: 'bg-green-500/10 text-green-500 border-green-500/20', icon: 'CheckCircle' },
  fail: { label: 'Fail', color: 'bg-red-500/10 text-red-500 border-red-500/20', icon: 'XCircle' },
  na: { label: 'N/A', color: 'bg-gray-500/10 text-gray-400 border-gray-500/20', icon: 'MinusCircle' },
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', icon: 'Clock' },
};

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG?.[status] || STATUS_CONFIG?.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg?.color}`}>
      <Icon name={cfg?.icon} size={10} />
      {cfg?.label}
    </span>
  );
};

const SecurityComplianceAuditScreen = () => {
  const { userProfile } = useAuth();
  const isAdmin = userProfile?.role === 'admin' || userProfile?.role === 'super_admin';

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ status: '', notes: '' });
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadItems = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase?.from('security_audit_checklist')?.select('*')?.order('category');
      if (error) throw error;
      setItems(data || []);
    } catch (err) {
      console.error('SecurityAudit load error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadItems(); }, [loadItems]);

  const startEdit = (item) => {
    setEditingId(item?.id);
    setEditForm({ status: item?.status, notes: item?.notes || '' });
  };

  const saveEdit = async (id) => {
    setSaving(true);
    try {
      const { error } = await supabase?.from('security_audit_checklist')?.update({
        status: editForm?.status,
        notes: editForm?.notes,
        last_checked_at: new Date()?.toISOString(),
        updated_at: new Date()?.toISOString()
      })?.eq('id', id);
      if (error) throw error;
      setEditingId(null);
      await loadItems();
      showToast('Checklist item updated');
    } catch (err) {
      showToast(err?.message || 'Save failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const exportCSV = () => {
    const rows = [['Category', 'Title', 'Status', 'Notes', 'Last Checked']];
    items?.forEach(item => {
      rows?.push([
        CATEGORY_LABELS?.[item?.category] || item?.category,
        item?.title,
        item?.status,
        item?.notes || '',
        item?.last_checked_at ? new Date(item.last_checked_at)?.toLocaleDateString() : ''
      ]);
    });
    const csv = rows?.map(r => r?.map(c => `"${String(c).replace(/"/g, '""')}"`)?.join(','))?.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-audit-${new Date()?.toISOString()?.split('T')?.[0]}.csv`;
    a?.click();
    URL.revokeObjectURL(url);
  };

  const exportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text('Security & Compliance Audit', 14, 20);
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date()?.toLocaleString()}`, 14, 28);
      const tableData = (items || []).map(item => [
        CATEGORY_LABELS?.[item?.category] || item?.category,
        item?.title || '',
        item?.status || '',
        (item?.notes || '').slice(0, 40),
        item?.last_checked_at ? new Date(item.last_checked_at)?.toLocaleDateString() : ''
      ]);
      doc.autoTable({
        startY: 34,
        head: [['Category', 'Title', 'Status', 'Notes', 'Last Checked']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] },
      });
      doc.save(`security-audit-${new Date()?.toISOString()?.split('T')?.[0]}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      showToast('PDF export failed', 'error');
    }
  };

  const categories = ['all', ...Object.keys(CATEGORY_LABELS)];
  const filtered = activeCategory === 'all' ? items : items?.filter(i => i?.category === activeCategory);
  const grouped = filtered?.reduce((acc, item) => {
    if (!acc?.[item?.category]) acc[item.category] = [];
    acc?.[item?.category]?.push(item);
    return acc;
  }, {});

  const passCount = items?.filter(i => i?.status === 'pass')?.length;
  const failCount = items?.filter(i => i?.status === 'fail')?.length;
  const pendingCount = items?.filter(i => i?.status === 'pending')?.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <div className="flex">
          <LeftSidebar />
          <main className="flex-1 pt-20 lg:ml-64 xl:ml-72 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Security & Compliance Audit | Vottery</title></Helmet>
      <HeaderNavigation />
      <div className="flex">
        <LeftSidebar />
        <main className="flex-1 pt-20 pb-8 lg:ml-64 xl:ml-72">
          <div className="max-w-5xl mx-auto px-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Icon name="ShieldCheck" size={24} className="text-primary" />
                  Security & Compliance Audit
                </h1>
                <p className="text-muted-foreground text-sm mt-1">Encryption, GDPR/CCPA, penetration testing, and pre-launch security checklist</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {!isAdmin && <span className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">Read-only</span>}
                {isAdmin && (
                  <Button
                    onClick={async () => {
                      const preLaunchItem = items?.find(i => i?.item_key === 'security_signoff');
                      if (!preLaunchItem) return;
                      setSaving(true);
                      try {
                        const { error } = await supabase?.from('security_audit_checklist')?.update({
                          status: 'pass',
                          notes: (preLaunchItem?.notes || '') + (preLaunchItem?.notes ? '; ' : '') + `Pre-launch sign-off completed ${new Date()?.toISOString()?.split('T')?.[0]}`,
                          last_checked_at: new Date()?.toISOString(),
                          updated_at: new Date()?.toISOString()
                        })?.eq('id', preLaunchItem?.id);
                        if (error) throw error;
                        await loadItems();
                        showToast('Pre-launch security sign-off recorded');
                      } catch (err) {
                        showToast(err?.message || 'Sign-off failed', 'error');
                      } finally {
                        setSaving(false);
                      }
                    }}
                    disabled={saving}
                    className="flex items-center gap-2 text-sm bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Icon name="CheckCircle" size={14} />
                    Complete Pre-Launch Sign-Off
                  </Button>
                )}
                <Button onClick={exportCSV} variant="outline" className="flex items-center gap-2 text-sm">
                  <Icon name="Download" size={14} />
                  Export CSV
                </Button>
                <Button onClick={exportPDF} variant="outline" className="flex items-center gap-2 text-sm">
                  <Icon name="FileText" size={14} />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Toast */}
            {toast && (
              <div className={`mb-4 px-4 py-3 rounded-lg text-sm font-medium ${
                toast?.type === 'error' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
              }`}>
                {toast?.msg}
              </div>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-green-500">{passCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Passing</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-red-500">{failCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Failing</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-yellow-500">{pendingCount}</p>
                <p className="text-xs text-muted-foreground mt-1">Pending</p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              {categories?.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeCategory === cat ? 'bg-primary text-primary-foreground' : 'bg-muted/30 text-muted-foreground hover:text-foreground border border-border'
                  }`}
                >
                  {cat === 'all' ? 'All' : CATEGORY_LABELS?.[cat]}
                </button>
              ))}
            </div>

            {/* Checklist */}
            <div className="space-y-6">
              {Object.entries(grouped)?.map(([category, catItems]) => (
                <div key={category} className="bg-card border border-border rounded-xl overflow-hidden">
                  <div className="px-5 py-3 bg-muted/30 border-b border-border">
                    <h3 className="font-semibold text-foreground text-sm">{CATEGORY_LABELS?.[category] || category}</h3>
                  </div>
                  <div className="divide-y divide-border">
                    {catItems?.map(item => (
                      <div key={item?.id} className="p-4">
                        {editingId === item?.id ? (
                          <div className="space-y-3">
                            <p className="font-medium text-foreground text-sm">{item?.title}</p>
                            <div className="flex gap-2">
                              {Object.keys(STATUS_CONFIG)?.map(s => (
                                <button
                                  key={s}
                                  onClick={() => setEditForm(f => ({ ...f, status: s }))}
                                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all ${
                                    editForm?.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border text-muted-foreground hover:border-primary/50'
                                  }`}
                                >
                                  {STATUS_CONFIG?.[s]?.label}
                                </button>
                              ))}
                            </div>
                            <textarea
                              value={editForm?.notes}
                              onChange={e => setEditForm(f => ({ ...f, notes: e?.target?.value }))}
                              placeholder="Add notes..."
                              rows={2}
                              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                            <div className="flex gap-2">
                              <Button onClick={() => saveEdit(item?.id)} disabled={saving} className="text-xs px-3 py-1.5">
                                {saving ? 'Saving...' : 'Save'}
                              </Button>
                              <Button onClick={() => setEditingId(null)} variant="outline" className="text-xs px-3 py-1.5">Cancel</Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-foreground text-sm">{item?.title}</p>
                                <StatusBadge status={item?.status} />
                              </div>
                              {item?.description && <p className="text-xs text-muted-foreground mb-1">{item?.description}</p>}
                              {item?.notes && <p className="text-xs text-muted-foreground italic">Note: {item?.notes}</p>}
                              {item?.last_checked_at && (
                                <p className="text-xs text-muted-foreground mt-1">Last checked: {new Date(item.last_checked_at)?.toLocaleDateString()}</p>
                              )}
                            </div>
                            {isAdmin && (
                              <button onClick={() => startEdit(item)} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                                <Icon name="Edit2" size={14} />
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SecurityComplianceAuditScreen;
