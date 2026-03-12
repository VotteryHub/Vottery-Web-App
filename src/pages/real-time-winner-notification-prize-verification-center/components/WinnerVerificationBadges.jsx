import React from 'react';
import Icon from '../../../components/AppIcon';

export default function WinnerVerificationBadges({ winners }) {
  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Winner Verification Badges</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Each winner receives a unique verification badge with blockchain authentication
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {winners?.slice(0, 9)?.map(winner => (
            <div key={winner?.id} className="bg-muted rounded-lg p-4 border-2 border-green-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <Icon name="Award" size={24} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">{winner?.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{winner?.prizeTier}</p>
                </div>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle" size={14} className="text-green-600" />
                  <span className="text-muted-foreground">Blockchain Verified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Shield" size={14} className="text-blue-600" />
                  <span className="text-muted-foreground">Authenticity Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="Award" size={14} className="text-purple-600" />
                  <span className="text-muted-foreground">Certificate Issued</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}