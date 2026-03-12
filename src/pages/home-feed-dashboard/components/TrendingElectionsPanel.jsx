import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TrendingElectionsPanel = ({ elections = [] }) => {
  return (
    <div className="card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground flex items-center gap-2">
          <Icon name="TrendingUp" size={24} strokeWidth={2.5} className="text-primary" />
          Trending Elections
        </h3>
        <Link to="/elections-dashboard" className="text-sm text-primary hover:underline">
          View All
        </Link>
      </div>
      {elections?.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          No trending elections at the moment
        </p>
      ) : (
        <div className="space-y-3">
          {elections?.map((election) => (
            <Link
              key={election?.id}
              to={`/secure-voting-interface?election=${election?.id}`}
              className="block p-3 rounded-lg hover:bg-muted transition-colors duration-250"
            >
              <div className="flex gap-3">
                <Image
                  src={election?.coverImage || 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=200'}
                  alt={election?.coverImageAlt || 'Election image'}
                  className="w-12 h-12 rounded object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground line-clamp-1 mb-1">
                    {election?.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="Users" size={16} strokeWidth={2.5} />
                      {election?.totalVoters || 0}
                    </span>
                    {election?.category && (
                      <>
                        <span>·</span>
                        <span>{election?.category}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendingElectionsPanel;