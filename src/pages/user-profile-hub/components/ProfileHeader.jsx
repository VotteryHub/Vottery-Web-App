import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ProfileHeader = ({ user, onEditProfile, onAvatarChange }) => {
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [bioText, setBioText] = useState(user?.bio);

  const handleBioSave = () => {
    setIsEditingBio(false);
    // Bio save logic would go here
  };

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden">
      <div className="relative h-32 md:h-40 lg:h-48 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
      </div>
      <div className="px-4 md:px-6 lg:px-8 pb-6">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 -mt-12 md:-mt-16 lg:-mt-20">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full border-4 border-card bg-card overflow-hidden shadow-democratic-lg flex items-center justify-center bg-gradient-to-br from-primary to-primary-foreground">
                {user?.avatar ? (
                  <Image
                    src={user?.avatar}
                    alt={user?.avatarAlt}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-4xl md:text-5xl lg:text-6xl font-black text-white uppercase">
                    {(user?.name || user?.full_name || user?.username || 'U').charAt(0)}
                  </span>
                )}
              </div>
              <button
                onClick={onAvatarChange}
                className="absolute bottom-2 right-2 w-8 h-8 md:w-10 md:h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-250 shadow-democratic-md hover:scale-110"
              >
                <Icon name="Camera" size={16} />
              </button>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-bold text-foreground">
                  {user?.name}
                </h1>
                {user?.verified && (
                  <div className="crypto-indicator">
                    <Icon name="ShieldCheck" size={16} />
                    <span className="text-xs">Verified</span>
                  </div>
                )}
              </div>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                @{user?.username}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs md:text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="Calendar" size={14} />
                  Joined {user?.joinDate}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="MapPin" size={14} />
                  {user?.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="default"
              iconName="Share2"
              iconPosition="left"
              className="flex-1 sm:flex-none"
            >
              Share Profile
            </Button>
            <Button
              variant="default"
              size="default"
              iconName="Edit"
              iconPosition="left"
              onClick={onEditProfile}
              className="flex-1 sm:flex-none"
            >
              Edit Profile
            </Button>
          </div>
        </div>

        <div className="mt-6">
          {isEditingBio ? (
            <div className="space-y-3">
              <textarea
                value={bioText}
                onChange={(e) => setBioText(e?.target?.value)}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground resize-none focus:outline-none focus:ring-3 focus:ring-ring"
                rows={3}
                maxLength={200}
                placeholder="Tell us about yourself..."
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {bioText?.length}/200 characters
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditingBio(false);
                      setBioText(user?.bio);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button variant="default" size="sm" onClick={handleBioSave}>
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between gap-4">
              <p className="text-sm md:text-base text-foreground leading-relaxed flex-1">
                {user?.bio}
              </p>
              <button
                onClick={() => setIsEditingBio(true)}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <Icon name="Edit2" size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-border">
          <div className="text-center">
            <p className="text-xl md:text-2xl font-heading font-bold text-foreground">
              {user?.stats?.votes}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Votes Cast</p>
          </div>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-heading font-bold text-foreground">
              {user?.stats?.elections}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Elections Created</p>
          </div>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-heading font-bold text-foreground">
              {user?.stats?.friends}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Friends</p>
          </div>
          <div className="text-center">
            <p className="text-xl md:text-2xl font-heading font-bold text-foreground">
              {user?.stats?.groups}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground">Hubs</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;