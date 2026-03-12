import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Icon from '../../components/AppIcon';
import { usePayout } from './hooks/usePayout';
import ThresholdProgress from './components/ThresholdProgress';
import BalanceCard from './components/BalanceCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import PayoutHistory from './components/PayoutHistory';
import RequestPayoutForm from './components/RequestPayoutForm';
import { PAYOUT_SUCCESS } from './constants';

/**
 * YouTube-style payout screen: threshold progress, next payment date,
 * single payment method, request form (when above threshold), payment history.
 */
export default function PayoutScreen() {
  const {
    wallet,
    settings,
    history,
    loading,
    error,
    requesting,
    refresh,
    requestPayout,
    availableBalance,
    meetsThreshold,
    amountToThreshold,
    nextPaymentDate,
    threshold,
    formatCurrency,
  } = usePayout();

  const [successMessage, setSuccessMessage] = useState('');

  const handleRequestPayout = async (amount, options) => {
    setSuccessMessage('');
    const result = await requestPayout(amount, options);
    if (result.success) setSuccessMessage(result.message || PAYOUT_SUCCESS.REQUEST_SUBMITTED);
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <HeaderNavigation />
        <main className="max-w-[900px] mx-auto px-4 py-8 flex items-center justify-center">
          <div className="text-center">
            <Icon name="Loader" size={40} className="text-primary animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading earnings...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Earnings & payouts – Vottery</title>
        <meta name="description" content="View balance, payment threshold, and payout history." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <HeaderNavigation />

        <main className="max-w-[900px] mx-auto px-4 py-6 md:py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
                Earnings & payouts
              </h1>
              <p className="text-muted-foreground mt-1">
                Track your balance and get paid on the next payment date.
              </p>
            </div>
            <button
              type="button"
              onClick={refresh}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <Icon name="RefreshCw" size={16} />
              Refresh
            </button>
          </div>

          <div className="space-y-6">
            <BalanceCard
              availableBalance={availableBalance}
              nextPaymentDate={nextPaymentDate}
              formatCurrency={formatCurrency}
              currency={wallet?.currency || 'USD'}
            />

            <ThresholdProgress
              availableBalance={availableBalance}
              threshold={threshold}
              amountToThreshold={amountToThreshold}
              formatCurrency={formatCurrency}
            />

            <PaymentMethodCard settings={settings} onManage={() => {}} />

            <RequestPayoutForm
              availableBalance={availableBalance}
              meetsThreshold={meetsThreshold}
              threshold={threshold}
              formatCurrency={formatCurrency}
              onRequest={handleRequestPayout}
              requesting={requesting}
              error={error}
              successMessage={successMessage}
            />

            <PayoutHistory
              history={history}
              formatCurrency={formatCurrency}
              formatDate={formatDate}
            />
          </div>
        </main>
      </div>
    </>
  );
}
