import React, { useState, useEffect } from 'react';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { voterRollsService } from '../../services/voterRollsService';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';
import { hasAnyRole } from '../../constants/roles';

const VoterRollsManagement = () => {
  const { user, userProfile } = useAuth();
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [rolls, setRolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importText, setImportText] = useState('');
  const [addEmail, setAddEmail] = useState('');
  const canManage = hasAnyRole(userProfile?.role, ['creator', 'admin']);

  useEffect(() => {
    loadElections();
  }, []);

  useEffect(() => {
    if (selectedElection?.id) {
      loadRolls(selectedElection.id);
    } else {
      setRolls([]);
    }
  }, [selectedElection?.id]);

  const loadElections = async () => {
    try {
      setLoading(true);
      const { data } = await electionsService?.getAll({});
      const mine = (data || [])?.filter(
        (e) => e?.createdBy === user?.id || hasAnyRole(userProfile?.role, ['admin'])
      );
      setElections(mine || []);
      if (mine?.length > 0 && !selectedElection) {
        setSelectedElection(mine[0]);
      }
    } catch (err) {
      console.error('Failed to load elections:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRolls = async (electionId) => {
    try {
      const { data, error } = await voterRollsService?.getByElection(electionId);
      if (error) throw new Error(error?.message);
      setRolls(data || []);
    } catch (err) {
      console.error('Failed to load voter rolls:', err);
      setRolls([]);
    }
  };

  const handleBulkImport = async () => {
    if (!selectedElection?.id || !importText?.trim()) return;
    const lines = importText?.split(/[\n,;]/)?.map((l) => l?.trim())?.filter(Boolean) || [];
    const entries = lines?.map((line) => {
      if (line?.includes('@')) return { email: line };
      return { email: line };
    });
    try {
      const { error } = await voterRollsService?.bulkImport(selectedElection.id, entries);
      if (error) throw new Error(error?.message);
      setImportText('');
      await loadRolls(selectedElection.id);
    } catch (err) {
      console.error('Bulk import failed:', err);
    }
  };

  const handleAddEmail = async () => {
    if (!selectedElection?.id || !addEmail?.trim()) return;
    try {
      const { error } = await voterRollsService?.addEntry(selectedElection.id, { email: addEmail?.trim() });
      if (error) throw new Error(error?.message);
      setAddEmail('');
      await loadRolls(selectedElection.id);
    } catch (err) {
      console.error('Add failed:', err);
    }
  };

  const handleVerify = async (rollId, status) => {
    try {
      await voterRollsService?.verifyEntry(rollId, status);
      await loadRolls(selectedElection?.id);
    } catch (err) {
      console.error('Verify failed:', err);
    }
  };

  const handleRemove = async (rollId) => {
    try {
      await voterRollsService?.removeEntry(rollId);
      await loadRolls(selectedElection?.id);
    } catch (err) {
      console.error('Remove failed:', err);
    }
  };

  if (!canManage) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="max-w-4xl mx-auto px-4 py-12 text-center">
          <Icon name="ShieldOff" size={64} className="text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You need creator or admin role to manage voter rolls.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">Voter Rolls Management</h1>
        <p className="text-muted-foreground mb-6">
          Import and verify voter lists for private (invite-only) elections.
        </p>

        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">Select Election</label>
          <select
            value={selectedElection?.id || ''}
            onChange={(e) => {
              const el = elections?.find((x) => x?.id === e?.target?.value);
              setSelectedElection(el || null);
            }}
            className="w-full max-w-md px-4 py-2 rounded-lg border border-border bg-card text-foreground"
          >
            <option value="">-- Select election --</option>
            {elections?.map((e) => (
              <option key={e?.id} value={e?.id}>
                {e?.title} ({e?.status})
              </option>
            ))}
          </select>
        </div>

        {selectedElection && (
          <>
            <div className="bg-card border border-border rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-foreground mb-3">Add / Import Voters</h3>
              <div className="flex gap-2 mb-3">
                <input
                  type="email"
                  placeholder="Email address"
                  value={addEmail}
                  onChange={(e) => setAddEmail(e?.target?.value)}
                  className="flex-1 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                />
                <Button onClick={handleAddEmail} size="sm">Add</Button>
              </div>
              <div>
                <textarea
                  placeholder="Bulk import: one email per line, or comma/semicolon separated"
                  value={importText}
                  onChange={(e) => setImportText(e?.target?.value)}
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground mb-2"
                />
                <Button variant="outline" size="sm" onClick={handleBulkImport}>Import</Button>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <h3 className="font-semibold text-foreground p-4 border-b border-border">
                Voter Roll ({rolls?.length})
              </h3>
              <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
                {rolls?.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No voters on the roll. Add or import above.
                  </div>
                ) : (
                  rolls?.map((r) => (
                    <div
                      key={r?.id}
                      className="flex items-center justify-between p-4 hover:bg-muted/50"
                    >
                      <div>
                        <span className="font-medium text-foreground">
                          {r?.email || r?.userId || '—'}
                        </span>
                        {r?.email && (
                          <span className="text-sm text-muted-foreground ml-2">{r?.email}</span>
                        )}
                        <span
                          className={`ml-2 text-xs px-2 py-0.5 rounded ${
                            r?.status === 'verified'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : r?.status === 'rejected'
                                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          }`}
                        >
                          {r?.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {r?.status !== 'verified' && (
                          <Button variant="outline" size="sm" onClick={() => handleVerify(r?.id, 'verified')}>
                            Verify
                          </Button>
                        )}
                        {r?.status !== 'rejected' && (
                          <Button variant="outline" size="sm" onClick={() => handleVerify(r?.id, 'rejected')}>
                            Reject
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => handleRemove(r?.id)}>
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default VoterRollsManagement;
