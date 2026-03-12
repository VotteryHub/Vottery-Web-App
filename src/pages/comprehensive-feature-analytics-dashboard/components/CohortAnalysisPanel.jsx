import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../lib/supabase';

const COHORT_TYPES = [
  { id: 'signup_week', label: 'Signup Week' },
  { id: 'role', label: 'User Role' },
  { id: 'country', label: 'Country' },
];

const MOCK_COHORTS = {
  signup_week: [
    { label: 'Week 1 (Jan 1-7)', users: 1240, retention7d: 78, retention30d: 54, avgSessions: 12.3, adoptionRate: 82 },
    { label: 'Week 2 (Jan 8-14)', users: 1890, retention7d: 71, retention30d: 48, avgSessions: 10.1, adoptionRate: 76 },
    { label: 'Week 3 (Jan 15-21)', users: 2340, retention7d: 69, retention30d: 45, avgSessions: 9.8, adoptionRate: 71 },
    { label: 'Week 4 (Jan 22-28)', users: 1780, retention7d: 74, retention30d: 51, avgSessions: 11.2, adoptionRate: 79 },
    { label: 'Week 5 (Jan 29+)', users: 3120, retention7d: 81, retention30d: 62, avgSessions: 14.5, adoptionRate: 88 },
  ],
  role: [
    { label: 'Voter', users: 8420, retention7d: 72, retention30d: 49, avgSessions: 8.4, adoptionRate: 74 },
    { label: 'Creator', users: 1230, retention7d: 85, retention30d: 67, avgSessions: 18.2, adoptionRate: 91 },
    { label: 'Advertiser', users: 340, retention7d: 88, retention30d: 72, avgSessions: 22.1, adoptionRate: 95 },
    { label: 'Admin', users: 45, retention7d: 96, retention30d: 89, avgSessions: 35.6, adoptionRate: 99 },
  ],
  country: [
    { label: 'United States', users: 4210, retention7d: 76, retention30d: 53, avgSessions: 11.2, adoptionRate: 81 },
    { label: 'United Kingdom', users: 1890, retention7d: 74, retention30d: 51, avgSessions: 10.8, adoptionRate: 78 },
    { label: 'Canada', users: 1240, retention7d: 78, retention30d: 55, avgSessions: 12.1, adoptionRate: 83 },
    { label: 'Australia', users: 890, retention7d: 71, retention30d: 48, avgSessions: 9.4, adoptionRate: 75 },
    { label: 'Germany', users: 760, retention7d: 69, retention30d: 46, avgSessions: 8.9, adoptionRate: 72 },
  ],
};

const CohortAnalysisPanel = ({ timeRange }) => {
  const [cohortType, setCohortType] = useState('signup_week');
  const [cohorts, setCohorts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchCohorts = async () => {
      setLoading(true);
      try {
        const { count } = await supabase
          ?.from('user_profiles')
          ?.select('*', { count: 'exact', head: true });
        setTotalUsers(count || 0);
      } catch (err) {
        console.error('Cohort fetch error:', err);
      } finally {
        setCohorts(MOCK_COHORTS?.[cohortType] || []);
        setLoading(false);
      }
    };
    fetchCohorts();
  }, [cohortType, timeRange]);

  return (
    <div>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {COHORT_TYPES?.map((type) => (
            <button
              key={type?.id}
              onClick={() => setCohortType(type?.id)}
              className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                cohortType === type?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {type?.label}
            </button>
          ))}
        </div>
        <div className="text-sm text-muted-foreground">
          Total users: <span className="font-semibold text-foreground">{totalUsers?.toLocaleString()}</span>
        </div>
      </div>
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3]?.map((i) => <div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />)}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Cohort Heatmap */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left text-xs font-medium text-muted-foreground pb-3 pr-4">Cohort</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3 px-4">Users</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3 px-4">7d Retention</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3 px-4">30d Retention</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3 px-4">Avg Sessions</th>
                  <th className="text-right text-xs font-medium text-muted-foreground pb-3 pl-4">Adoption Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {cohorts?.map((cohort) => (
                  <tr key={cohort?.label} className="hover:bg-muted/30 transition-colors">
                    <td className="py-3 pr-4">
                      <span className="text-sm font-medium text-foreground">{cohort?.label}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-foreground">{cohort?.users?.toLocaleString()}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 bg-muted rounded-full h-1.5">
                          <div
                            className="bg-blue-500 rounded-full h-1.5"
                            style={{ width: `${cohort?.retention7d}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground w-8 text-right">{cohort?.retention7d}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 bg-muted rounded-full h-1.5">
                          <div
                            className="bg-purple-500 rounded-full h-1.5"
                            style={{ width: `${cohort?.retention30d}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium text-foreground w-8 text-right">{cohort?.retention30d}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-sm text-foreground">{cohort?.avgSessions}</span>
                    </td>
                    <td className="py-3 pl-4 text-right">
                      <span className={`text-sm font-medium ${
                        cohort?.adoptionRate >= 80 ? 'text-green-500' :
                        cohort?.adoptionRate >= 60 ? 'text-yellow-500' : 'text-red-500'
                      }`}>{cohort?.adoptionRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Lifecycle Tracking */}
          <div className="mt-6 p-4 bg-muted/30 rounded-xl">
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Icon name="Activity" size={16} className="text-primary" />
              Lifecycle Tracking
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-500">68%</p>
                <p className="text-xs text-muted-foreground mt-1">Activation Rate</p>
                <p className="text-xs text-muted-foreground">(completed onboarding)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-500">52%</p>
                <p className="text-xs text-muted-foreground mt-1">30-Day Retention</p>
                <p className="text-xs text-muted-foreground">(returned after 30 days)</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-500">34%</p>
                <p className="text-xs text-muted-foreground mt-1">Power Users</p>
                <p className="text-xs text-muted-foreground">(10+ sessions/month)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CohortAnalysisPanel;
