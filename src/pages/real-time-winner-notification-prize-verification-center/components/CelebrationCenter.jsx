import React from 'react';
import Icon from '../../../components/AppIcon';

export default function CelebrationCenter({ winners, celebrationMode }) {
  const recentWinners = winners?.slice(0, 5) || [];

  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-lg p-8 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="text-9xl animate-bounce">🎉</div>
        </div>
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-2">🎊 Celebration Center 🎊</h2>
          <p className="text-xl">Share the joy of winning with the community!</p>
        </div>
      </div>

      {/* Recent Winners Celebration */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentWinners?.map((winner, index) => (
          <div
            key={winner?.id}
            className="bg-card rounded-lg border-2 border-yellow-400 p-6 text-center transform hover:scale-105 transition-transform"
          >
            <div className="text-6xl mb-4 animate-bounce" style={{ animationDelay: `${index * 0.2}s` }}>
              🏆
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">{winner?.user?.name}</h3>
            <div className="text-3xl font-bold text-yellow-600 mb-2">
              ${parseFloat(winner?.prizeAmount)?.toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground mb-4">{winner?.prizeTier}</p>
            <div className="flex justify-center gap-2">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                <Icon name="Share2" size={16} className="inline mr-1" />
                Share
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm">
                <Icon name="Heart" size={16} className="inline mr-1" />
                Congratulate
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Celebration Stats */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Celebration Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-4xl mb-2">🎉</div>
            <div className="text-2xl font-bold text-foreground">{winners?.length || 0}</div>
            <div className="text-sm text-muted-foreground">Total Celebrations</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-2xl font-bold text-foreground">
              ${winners?.reduce((sum, w) => sum + parseFloat(w?.prizeAmount || 0), 0)?.toLocaleString()}
            </div>
            <div className="text-sm text-muted-foreground">Total Prizes Distributed</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-4xl mb-2">🌟</div>
            <div className="text-2xl font-bold text-foreground">100%</div>
            <div className="text-sm text-muted-foreground">Happiness Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
}