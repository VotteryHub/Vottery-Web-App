import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import {
  initializeLotteryDraw,
  selectLotteryWinners,
  getLotteryAuditTrail,
} from '../../../services/lotteryService';
import SlotMachine3D from '../../3d-gamified-election-experience-center/components/SlotMachine3D';

export default function WinnerSelectionEngine({ campaign }) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedWinners, setSelectedWinners] = useState([]);
  const [selectionMode, setSelectionMode] = useState('scheduled');
  const [scheduledTime, setScheduledTime] = useState('');
  const [lotteryMeta, setLotteryMeta] = useState(null);
  const [error, setError] = useState('');

  const triggerWinnerSelection = async () => {
    if (!campaign?.electionId) return;

    setIsSelecting(true);
    setError('');

    try {
      const lotteryId = await initializeLotteryDraw(campaign.electionId);
      const { randomSeed, winners } = await selectLotteryWinners({
        lotteryId,
        winnerCount: campaign?.winnerCount ?? 3,
      });

      const auditTrail = await getLotteryAuditTrail(lotteryId);

      setLotteryMeta({
        lotteryId,
        randomSeed,
        auditTrail,
      });
      setSelectedWinners(winners);
    } catch (err) {
      setError(err?.message ?? 'Failed to select winners. Please try again.');
    } finally {
      setIsSelecting(false);
    }
  };

  const scheduleSelection = () => {
    console.log('Scheduled for:', scheduledTime);
  };

  if (!campaign) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center">
        <Icon name="AlertCircle" className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          No Campaign Selected
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Please select a campaign from the Campaign Management tab to proceed with winner selection.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* RNG Engine Status */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <Icon name="Shield" className="w-8 h-8" />
          <h2 className="text-xl font-bold">Cryptographically Secure RNG Engine</h2>
        </div>
        <p className="text-purple-100">
          Real-time winner selection using cryptographic seeds and backend-verified randomness, with
          blockchain-ready audit trails and automated prize distribution via Stripe.
        </p>
        {lotteryMeta && (
          <div className="mt-4 space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <Icon name="CheckCircle" className="w-4 h-4 text-green-300" />
              <span className="text-sm">
                Lottery ID: <span className="font-mono">{lotteryMeta.lotteryId}</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="Key" className="w-4 h-4 text-green-300" />
              <span className="text-sm">
                Random Seed (hash):{' '}
                <span className="font-mono">
                  {lotteryMeta.randomSeed?.toString().substring(0, 24)}...
                </span>
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Selection Mode */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Selection Mode
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setSelectionMode('manual')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectionMode === 'manual' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Icon name="Hand" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Manual Trigger</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Select winners immediately</p>
          </button>

          <button
            onClick={() => setSelectionMode('scheduled')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectionMode === 'scheduled' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Icon name="Clock" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Scheduled Selection</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Automate at specific time</p>
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-800 dark:text-red-200 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Manual Trigger */}
      {selectionMode === 'manual' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Manual Winner Selection
          </h3>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Icon name="Info" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-medium mb-1">Campaign: {campaign?.name}</p>
                  <p>Prize Pool: ${campaign?.prizePool?.toLocaleString()}</p>
                  <p>Eligible Users: {campaign?.eligibleUsers?.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <button
              onClick={triggerWinnerSelection}
              disabled={isSelecting}
              className="w-full px-6 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg font-semibold"
            >
              {isSelecting ? (
                <>
                  <Icon name="Loader" className="w-6 h-6 animate-spin" />
                  Selecting Winners...
                </>
              ) : (
                <>
                  <Icon name="Zap" className="w-6 h-6" />
                  Trigger Winner Selection Now
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 3D Drawing Visualization */}
      {(isSelecting || selectedWinners?.length > 0) && (
        <div className="bg-slate-900 rounded-lg shadow-2xl p-6 border-2 border-yellow-500/30 overflow-hidden my-6">
          <h3 className="text-lg font-heading font-bold text-white mb-6 flex items-center gap-2">
            <Icon name="Target" className="text-yellow-500" />
            Live 3D Drawing Visualization
          </h3>
          <div className="h-[400px] bg-black/20 rounded-xl relative">
             <SlotMachine3D 
               election={campaign}
               isSpinning={isSelecting}
               winners={selectedWinners?.map(w => ({
                 user_profiles: { full_name: w.username, username: w.username },
                 prize_amount: w.prizeAmount,
                 prize_tier: w.prizeTier
               }))}
               animationSpeed={150}
               soundEnabled={true}
               motionReduced={false}
               onWinnerReveal={() => {}}
             />
          </div>
          {selectedWinners?.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-yellow-500 font-bold animate-bounce uppercase tracking-widest">
                🎉 DRAW COMPLETE! {selectedWinners.length} WINNERS IDENTIFIED 🎉
              </p>
            </div>
          )}
        </div>
      )}

      {/* Scheduled Selection */}
      {selectionMode === 'scheduled' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Schedule Winner Selection
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Selection Date & Time
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e?.target?.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <button
              onClick={scheduleSelection}
              disabled={!scheduledTime}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Schedule Selection
            </button>
          </div>
        </div>
      )}

      {/* Selected Winners */}
      {selectedWinners?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Selected Winners ({selectedWinners?.length})
            </h3>
            <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
              <Icon name="Send" className="w-4 h-4" />
              Distribute Prizes
            </button>
          </div>
          <div className="space-y-3">
            {selectedWinners?.map((winner) => (
              <div
                key={winner?.id}
                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-300 dark:hover:border-purple-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      winner?.prizeTier === '$1M Winner' ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
                    }`}>
                      <Icon name="Trophy" className={`w-5 h-5 ${
                        winner?.prizeTier === '$1M Winner' ? 'text-yellow-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{winner?.username}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{winner?.userId}</p>
                    </div>
                  </div>
                    <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      ${winner?.prizeAmount?.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">{winner?.prizeTier}</p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 font-mono">
                  Winner ID: {winner?.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lottery Audit Snippet */}
      {lotteryMeta?.auditTrail && lotteryMeta.auditTrail.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Lottery Audit Trail (latest)
          </h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-3">
            These entries can be cross-checked against the blockchain/audit portal for independent
            verification.
          </p>
          <div className="space-y-2 max-h-40 overflow-y-auto text-xs font-mono">
            {lotteryMeta.auditTrail.slice(0, 5).map((entry) => (
              <div
                key={entry.id}
                className="border border-gray-200 dark:border-gray-700 rounded px-2 py-1"
              >
                <div>{entry.event_type}</div>
                <div className="text-gray-500 dark:text-gray-400">
                  {entry.timestamp} · {entry.event_hash?.substring(0, 24)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}