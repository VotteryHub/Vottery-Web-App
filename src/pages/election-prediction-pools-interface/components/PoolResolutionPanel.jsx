import React, { useEffect, useRef } from 'react';

const PoolResolutionPanel = ({ resolutionData, onClose }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!resolutionData || !canvasRef?.current) return;
    const canvas = canvasRef?.current;
    const ctx = canvas?.getContext('2d');
    canvas.width = canvas?.offsetWidth;
    canvas.height = canvas?.offsetHeight;

    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas?.width,
      y: Math.random() * canvas?.height - canvas?.height,
      size: Math.random() * 8 + 4,
      color: ['#FFC629', '#7C3AED', '#10B981', '#3B82F6', '#EF4444']?.[Math.floor(Math.random() * 5)],
      speed: Math.random() * 3 + 1,
      angle: Math.random() * Math.PI * 2
    }));

    let animId;
    const animate = () => {
      ctx?.clearRect(0, 0, canvas?.width, canvas?.height);
      particles?.forEach(p => {
        p.y += p?.speed;
        p.x += Math.sin(p?.angle) * 0.5;
        if (p?.y > canvas?.height) { p.y = -10; p.x = Math.random() * canvas?.width; }
        ctx.fillStyle = p?.color;
        ctx?.beginPath();
        ctx?.arc(p?.x, p?.y, p?.size / 2, 0, Math.PI * 2);
        ctx?.fill();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();
    return () => cancelAnimationFrame(animId);
  }, [resolutionData]);

  if (!resolutionData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 z-10">
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Pool Resolved!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {resolutionData?.resolved} predictions scored
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-purple-600">{resolutionData?.resolved}</p>
              <p className="text-xs text-gray-500">Predictions Scored</p>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
              <p className="text-2xl font-bold text-green-600">
                {resolutionData?.averageBrierScore?.toFixed(3) ?? '—'}
              </p>
              <p className="text-xs text-gray-500">Avg Brier Score</p>
            </div>
          </div>
          {resolutionData?.topPerformers?.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">🏆 Top Performers</h3>
              {resolutionData?.topPerformers?.map((p, i) => (
                <div key={p?.id} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm">{['🥇', '🥈', '🥉']?.[i]} Rank #{i + 1}</span>
                  <span className="text-sm font-medium text-green-600">+{p?.vp_awarded} VP</span>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-colors"
          >
            View Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PoolResolutionPanel;
