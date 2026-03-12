import React, { useState } from 'react';
import { Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts';
import Icon from '../../../components/AppIcon';

const MLRevenueForecastPanel = () => {
  const [forecastHorizon, setForecastHorizon] = useState(30);
  const [scenario, setScenario] = useState('base');

  const generateForecastData = () => {
    const historical = Array.from({ length: 30 }, (_, i) => ({
      day: `Day ${i - 29}`,
      actual: 1200 + Math.random() * 600 + i * 15,
      type: 'historical'
    }));

    const scenarios = {
      optimistic: 1.15,
      base: 1.0,
      conservative: 0.85
    };

    const multiplier = scenarios?.[scenario];
    const lastActual = historical?.[historical?.length - 1]?.actual;

    const forecast = Array.from({ length: forecastHorizon }, (_, i) => ({
      day: `+${i + 1}d`,
      forecast: (lastActual + i * 18 * multiplier) * (0.95 + Math.random() * 0.1),
      upper: (lastActual + i * 22 * multiplier) * 1.1,
      lower: (lastActual + i * 14 * multiplier) * 0.9,
      type: 'forecast'
    }));

    return { historical, forecast };
  };

  const { historical, forecast } = generateForecastData();
  const combinedData = [...historical?.slice(-14), ...forecast];

  const totalForecast = forecast?.reduce((sum, d) => sum + d?.forecast, 0);
  const avgConfidence = 87 - (forecastHorizon / 90) * 15;

  const projections = [
    { days: 30, revenue: forecast?.slice(0, 30)?.reduce((sum, d) => sum + (d?.forecast || 0), 0), confidence: 89 },
    { days: 60, revenue: forecast?.slice(0, 60)?.reduce((sum, d) => sum + (d?.forecast || 0), 0), confidence: 82 },
    { days: 90, revenue: forecast?.slice(0, 90)?.reduce((sum, d) => sum + (d?.forecast || 0), 0), confidence: 74 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="TrendingUp" size={18} className="text-blue-500" />
          <span className="font-semibold text-foreground">ML Revenue Forecasting</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1 bg-background rounded-lg p-1">
            {[30, 60, 90]?.map(h => (
              <button
                key={h}
                onClick={() => setForecastHorizon(h)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  forecastHorizon === h ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {h}d
              </button>
            ))}
          </div>
          <select
            value={scenario}
            onChange={e => setScenario(e?.target?.value)}
            className="text-xs bg-background border border-border rounded-lg px-2 py-1 text-foreground"
          >
            <option value="optimistic">Optimistic</option>
            <option value="base">Base Case</option>
            <option value="conservative">Conservative</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {projections?.map(proj => (
          <div key={proj?.days} className={`rounded-xl p-4 border ${
            forecastHorizon === proj?.days ? 'border-primary bg-primary/10' : 'bg-card border-border'
          }`}>
            <p className="text-xs text-muted-foreground mb-1">{proj?.days}-Day Forecast</p>
            <p className="text-xl font-bold text-foreground">${proj?.revenue?.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</p>
            <div className="flex items-center gap-1 mt-2">
              <Icon name="Target" size={12} className="text-blue-500" />
              <span className="text-xs text-blue-500">{proj?.confidence}% confidence</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl p-6 border border-border">
        <h4 className="font-semibold text-foreground mb-4">Revenue Forecast with Confidence Intervals</h4>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={combinedData}>
            <defs>
              <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={6} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => v ? [`$${v?.toFixed(0)}`, ''] : ['-', '']} />
            <ReferenceLine x="+1d" stroke="#6366f1" strokeDasharray="4 4" label={{ value: 'Forecast Start', fontSize: 10 }} />
            <Area type="monotone" dataKey="upper" stroke="transparent" fill="#3b82f620" />
            <Area type="monotone" dataKey="lower" stroke="transparent" fill="#ffffff10" />
            <Line type="monotone" dataKey="actual" stroke="#22c55e" strokeWidth={2} dot={false} name="Historical" />
            <Line type="monotone" dataKey="forecast" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Forecast" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-green-500" /><span>Historical</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-0.5 bg-blue-500 border-dashed" /><span>Forecast ({scenario})</span></div>
          <div className="flex items-center gap-1"><div className="w-4 h-3 bg-blue-500/20 rounded" /><span>Confidence interval</span></div>
        </div>
      </div>
    </div>
  );
};

export default MLRevenueForecastPanel;