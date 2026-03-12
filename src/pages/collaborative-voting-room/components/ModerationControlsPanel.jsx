import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ModerationControlsPanel = ({ roomId, participants = [] }) => {
  const [muteList, setMuteList] = useState([]);
  const [roomLocked, setRoomLocked] = useState(false);

  const handleMuteParticipant = (participantId) => {
    if (muteList?.includes(participantId)) {
      setMuteList(prev => prev?.filter(id => id !== participantId));
    } else {
      setMuteList(prev => [...prev, participantId]);
    }
  };

  const handleLockRoom = () => {
    setRoomLocked(!roomLocked);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Icon name="Shield" className="w-5 h-5 text-purple-500" />
        <h2 className="text-lg font-bold text-foreground">Moderation Controls</h2>
      </div>

      <div className="space-y-4">
        {/* Room Controls */}
        <div className="p-4 bg-accent rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-3">Room Settings</h3>
          <div className="space-y-2">
            <button
              onClick={handleLockRoom}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                roomLocked ? 'bg-red-50 border border-red-200' : 'bg-background border border-border hover:border-primary'
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon name={roomLocked ? 'Lock' : 'Unlock'} className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {roomLocked ? 'Room Locked' : 'Room Open'}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {roomLocked ? 'No new participants' : 'Anyone can join'}
              </span>
            </button>
          </div>
        </div>

        {/* Participant Management */}
        <div className="p-4 bg-accent rounded-lg">
          <h3 className="text-sm font-semibold text-foreground mb-3">Manage Participants</h3>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {participants
              ?.filter(p => p?.role !== 'moderator')
              ?.map((participant) => (
                <div
                  key={participant?.id}
                  className="flex items-center justify-between p-2 bg-background rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                      {participant?.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm text-foreground">{participant?.name}</span>
                  </div>
                  <button
                    onClick={() => handleMuteParticipant(participant?.id)}
                    className={`p-1.5 rounded transition-colors ${
                      muteList?.includes(participant?.id)
                        ? 'bg-red-100 text-red-600' :'hover:bg-accent text-muted-foreground'
                    }`}
                    title={muteList?.includes(participant?.id) ? 'Unmute' : 'Mute'}
                  >
                    <Icon
                      name={muteList?.includes(participant?.id) ? 'MicOff' : 'Mic'}
                      className="w-4 h-4"
                    />
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="Download" className="w-4 h-4 mr-2" />
            Export Discussion
          </Button>
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Icon name="AlertCircle" className="w-4 h-4 mr-2" />
            Report Issue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ModerationControlsPanel;