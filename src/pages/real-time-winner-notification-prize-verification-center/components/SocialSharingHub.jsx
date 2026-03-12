import React from 'react';
import Icon from '../../../components/AppIcon';

export default function SocialSharingHub({ winners, campaign }) {
  const shareOnTwitter = (winner) => {
    const text = `🎉 ${winner?.user?.name} just won ${winner?.prizeTier} on Vottery! Join now for your chance to win! #Vottery #Winner`;
    window?.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Social Sharing Hub</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Share winner celebrations across social media platforms
        </p>
        <div className="space-y-4">
          {winners?.slice(0, 5)?.map(winner => (
            <div key={winner?.id} className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name="Trophy" size={24} className="text-yellow-600" />
                  <div>
                    <p className="font-semibold text-foreground">{winner?.user?.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Won ${parseFloat(winner?.prizeAmount)?.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => shareOnTwitter(winner)}
                    className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Icon name="Twitter" size={16} />
                  </button>
                  <button className="p-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors">
                    <Icon name="Facebook" size={16} />
                  </button>
                  <button className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Icon name="Linkedin" size={16} />
                  </button>
                  <button className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                    <Icon name="Share2" size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}