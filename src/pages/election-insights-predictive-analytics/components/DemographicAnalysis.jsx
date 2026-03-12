import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const DemographicAnalysis = ({ demographics, participation, geographic }) => {
  const [activeView, setActiveView] = useState('age');

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-heading font-semibold text-foreground">Demographic Analysis</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveView('age')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'age' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Age Groups
          </button>
          <button
            onClick={() => setActiveView('zones')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'zones' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Zones
          </button>
          <button
            onClick={() => setActiveView('geographic')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeView === 'geographic' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Geographic
          </button>
        </div>
      </div>

      {activeView === 'age' && (
        <>
          <div className="w-full h-80" aria-label="Demographic Shift Patterns Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={demographics}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="ageGroup" stroke="var(--color-muted-foreground)" />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="current" fill="#2563EB" name="Current" />
                <Bar dataKey="projected" fill="#7C3AED" name="Projected" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
            {demographics?.map((demo, index) => (
              <div key={index} className="p-3 rounded-lg bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">{demo?.ageGroup}</p>
                <p className="text-lg font-heading font-bold text-foreground">{demo?.growth}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {activeView === 'zones' && (
        <>
          <div className="w-full h-80" aria-label="Participation Rate Predictions Chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={participation}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis
                  dataKey="zone"
                  stroke="var(--color-muted-foreground)"
                  angle={-45}
                  textAnchor="end"
                  height={100}
                />
                <YAxis stroke="var(--color-muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--color-card)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="current" fill="#059669" name="Current Rate (%)" />
                <Bar dataKey="predicted" fill="#F59E0B" name="Predicted Rate (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-success/5 border border-success/20">
            <div className="flex items-start gap-3">
              <Icon name="TrendingUp" size={20} className="text-success mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground mb-1">Participation Growth Insight</p>
                <p className="text-xs text-muted-foreground">
                  Lower income zones (1-3) show highest growth potential with 18.9% projected increase in participation rates.
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {activeView === 'geographic' && (
        <>
          <div className="space-y-3">
            {geographic?.map((region, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="MapPin" size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{region?.region}</p>
                      <p className="text-xs text-muted-foreground">Dominant: {region?.dominantAge}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-heading font-bold text-foreground">{region?.votes?.toLocaleString()}</p>
                    <p className="text-xs text-success">{region?.growth}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-2">
                    <Icon name="Users" size={14} className="text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Turnout: {region?.turnout}%</span>
                  </div>
                  <div className="flex-1">
                    <div className="w-full bg-border rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-500"
                        style={{ width: `${region?.turnout}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default DemographicAnalysis;