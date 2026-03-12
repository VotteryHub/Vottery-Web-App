import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { payoutApi } from '../api';
import { PAYOUT_THRESHOLD, PAYOUT_ERRORS, PAYOUT_SUCCESS } from '../constants';

/**
 * Single hook for YouTube-style payout flow: wallet, threshold progress, history, request.
 * All errors use PAYOUT_ERRORS so Web and Mobile can match.
 */
export function usePayout() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(null);
  const [settings, setSettings] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requesting, setRequesting] = useState(false);

  const load = useCallback(async () => {
    if (!user?.id) {
      setWallet(null);
      setSettings(null);
      setHistory([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    const [w, s, h] = await Promise.all([
      payoutApi.getWallet(user.id),
      payoutApi.getPayoutSettings(user.id),
      payoutApi.getPayoutHistory(user.id),
    ]);
    if (w.error) setError(w.error.message);
    else setWallet(w.data);
    if (s.data) setSettings(s.data);
    if (h.data) setHistory(h.data);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    load();
  }, [load]);

  const requestPayout = useCallback(
    async (amount, options = {}) => {
      if (!user?.id) return { success: false, error: PAYOUT_ERRORS.NOT_AUTHENTICATED };
      setRequesting(true);
      setError(null);
      const result = await payoutApi.requestPayout(user.id, {
        amount: Number(amount),
        processingFee: options.processingFee ?? 0,
        paymentDetails: options.paymentDetails ?? {},
        method: options.method ?? 'bank_transfer',
        notes: options.notes,
      });
      setRequesting(false);
      if (result.error) {
        setError(result.error.message);
        return { success: false, error: result.error.message };
      }
      await load();
      return { success: true, message: PAYOUT_SUCCESS.REQUEST_SUBMITTED };
    },
    [user?.id, load]
  );

  const availableBalance = wallet ? Number(wallet.availableBalance) || 0 : 0;
  const meetsThreshold = availableBalance >= PAYOUT_THRESHOLD;
  const amountToThreshold = Math.max(0, PAYOUT_THRESHOLD - availableBalance);
  const nextPaymentDate = payoutApi.getNextPaymentDate();

  return {
    wallet,
    settings,
    history,
    loading,
    error,
    requesting,
    refresh: load,
    requestPayout,
    availableBalance,
    meetsThreshold,
    amountToThreshold,
    nextPaymentDate,
    threshold: PAYOUT_THRESHOLD,
    formatCurrency: payoutApi.formatCurrency,
  };
}
