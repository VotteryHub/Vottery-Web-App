import React, { useRef, useEffect, useState } from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import { QRCodeSVG } from 'qrcode.react';
import VotteryWordmark from '../../../components/branding/VotteryWordmark';

const AdvancedSettingsForm = ({ formData, onChange, errors }) => {
  const qrCodeRef = useRef(null);
  const [winnerDistribution, setWinnerDistribution] = useState(
    formData?.winnerDistribution || [{ position: 1, percentage: 100 }]
  );

  const categoryOptions = [
    { value: 'political', label: 'Political' },
    { value: 'community', label: 'Community' },
    { value: 'corporate', label: 'Corporate' },
    { value: 'educational', label: 'Educational' },
    { value: 'social', label: 'Social' },
    { value: 'entertainment', label: 'Entertainment' },
    { value: 'sports', label: 'Sports' },
    { value: 'other', label: 'Other' }
  ];

  const prizeTypeOptions = [
    { value: 'monetary', label: 'Monetary Prize (Cash)' },
    { value: 'non_monetary', label: 'Non-Monetary Prize (Voucher/Coupon)' },
    { value: 'projected_revenue', label: 'Projected Content Revenue' }
  ];

  const handleLogoUpload = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('brandingLogo', reader?.result);
      };
      reader?.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onChange('brandingLogo', '');
  };

  const addWinner = () => {
    const newDistribution = [...winnerDistribution, { position: winnerDistribution?.length + 1, percentage: 0 }];
    setWinnerDistribution(newDistribution);
    onChange('winnerDistribution', newDistribution);
  };

  const removeWinner = (index) => {
    const newDistribution = winnerDistribution?.filter((_, i) => i !== index)?.map((w, i) => ({ ...w, position: i + 1 }));
    setWinnerDistribution(newDistribution);
    onChange('winnerDistribution', newDistribution);
  };

  const updateWinnerPct = (index, pct) => {
    const newDistribution = winnerDistribution?.map((w, i) => i === index ? { ...w, percentage: parseFloat(pct) || 0 } : w);
    setWinnerDistribution(newDistribution);
    onChange('winnerDistribution', newDistribution);
  };

  const totalPct = winnerDistribution?.reduce((sum, w) => sum + (w?.percentage || 0), 0);

  const downloadQRCode = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas?.getContext('2d');
    const qrSize = 400;
      const logoSize = 80;
    
    canvas.width = qrSize;
    canvas.height = qrSize;

    // Draw white background
    ctx.fillStyle = '#FFFFFF';
    ctx?.fillRect(0, 0, qrSize, qrSize);

    // Get QR code SVG
    const svg = qrCodeRef?.current?.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer()?.serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const svgUrl = URL.createObjectURL(svgBlob);

    const qrImg = new Image();
      qrImg.onload = () => {
        // Draw QR code
        ctx?.drawImage(qrImg, 0, 0, qrSize, qrSize);

        // Compute vertical stack (creator logo on top, Vottery text below) centered in QR
        const hasBrandLogo = !!formData?.brandingLogo;
        const text = 'Vottery';
        const spacing = hasBrandLogo ? 10 : 0;
        const fontSize = 22;

        ctx.font = `700 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
        const textMetrics = ctx.measureText(text);
        const textHeight = fontSize;

        const groupHeight = (hasBrandLogo ? logoSize : 0) + (hasBrandLogo ? spacing : 0) + textHeight;
        const groupTop = (qrSize - groupHeight) / 2;

        const drawVotteryWordmark = () => {
          const textY =
            groupTop + (hasBrandLogo ? logoSize + spacing : 0) + textHeight;
          const textX = (qrSize - textMetrics.width) / 2;

          ctx.fillStyle = '#0F5FFF';
          ctx.fillText(text, textX, textY);
        };

        if (hasBrandLogo) {
          const logoImg = new Image();
          logoImg.onload = () => {
            const logoX = (qrSize - logoSize) / 2;
            const logoY = groupTop;

            // White rounded background behind brand logo
            ctx.fillStyle = '#FFFFFF';
            ctx.beginPath();
            ctx.moveTo(logoX - 6, logoY - 6);
            ctx.lineTo(logoX + logoSize + 6, logoY - 6);
            ctx.quadraticCurveTo(
              logoX + logoSize + 10,
              logoY - 6,
              logoX + logoSize + 10,
              logoY + 4
            );
            ctx.lineTo(logoX + logoSize + 10, logoY + logoSize + 6);
            ctx.quadraticCurveTo(
              logoX + logoSize + 10,
              logoY + logoSize + 10,
              logoX + logoSize + 6,
              logoY + logoSize + 10
            );
            ctx.lineTo(logoX - 6, logoY + logoSize + 10);
            ctx.quadraticCurveTo(
              logoX - 10,
              logoY + logoSize + 10,
              logoX - 10,
              logoY + logoSize + 6
            );
            ctx.lineTo(logoX - 10, logoY + 4);
            ctx.quadraticCurveTo(
              logoX - 10,
              logoY - 6,
              logoX - 6,
              logoY - 6
            );
            ctx.closePath();
            ctx.fill();

            // Draw creator logo
            ctx?.drawImage(logoImg, logoX, logoY, logoSize, logoSize);

            // Draw Vottery wordmark text underneath
            drawVotteryWordmark();

            const pngFile = canvas?.toDataURL('image/png');
            const downloadLink = document.createElement('a');
            downloadLink.download = `election-qr-${formData?.uniqueElectionId || 'preview'}.png`;
            downloadLink.href = pngFile;
            downloadLink?.click();

            URL.revokeObjectURL(svgUrl);
          };
          logoImg.src = formData?.brandingLogo;
        } else {
          // Only Vottery wordmark centered if no creator logo
          drawVotteryWordmark();

          const pngFile = canvas?.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `election-qr-${formData?.uniqueElectionId || 'preview'}.png`;
          downloadLink.href = pngFile;
          downloadLink?.click();

          URL.revokeObjectURL(svgUrl);
        }
      };
    qrImg.src = svgUrl;
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-2">
          Advanced Settings
        </h3>
        <p className="text-sm md:text-base text-muted-foreground">
          Configure additional election parameters and branding
        </p>
      </div>
      <Select
        label="Category"
        description="Select the category that best describes your election"
        options={categoryOptions}
        value={formData?.category}
        onChange={(value) => onChange('category', value)}
        error={errors?.category}
        required
      />
      <div className="space-y-4">
        <Checkbox
          label="Enable Gamification (Lotterized Election)"
          description="Convert votes into lottery tickets for prize draws"
          checked={formData?.enableGamification}
          onChange={(e) => onChange('enableGamification', e?.target?.checked)}
        />

        {formData?.enableGamification && (
          <div className="pl-0 md:pl-6 border-l-0 md:border-l-2 border-accent/20 space-y-4">
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-3 md:p-4">
              <div className="flex gap-3">
                <Icon name="Trophy" size={18} className="text-accent flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs md:text-sm text-foreground font-medium">
                    Lottery Features Enabled
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Each vote will automatically generate a lottery ticket. Winners will be selected using cryptographic RNG after voting closes.
                  </p>
                </div>
              </div>
            </div>

            <Select
              label="Prize Type"
              description="Choose the type of prize for this gamified election"
              options={prizeTypeOptions}
              value={formData?.prizeType || 'monetary'}
              onChange={(value) => onChange('prizeType', value)}
              required
            />

            {(!formData?.prizeType || formData?.prizeType === 'monetary') && (
              <Input
                label="Prize Pool Amount (USD)"
                type="number"
                placeholder="Enter prize amount"
                value={formData?.prizePool}
                onChange={(e) => onChange('prizePool', e?.target?.value)}
                error={errors?.prizePool}
                required
              />
            )}

            {formData?.prizeType === 'non_monetary' && (
              <div className="space-y-3">
                <Input
                  label="Voucher / Prize Description"
                  type="text"
                  placeholder="e.g. One week holiday trip in Dubai with 5-star hotel stay"
                  value={formData?.voucherDescription || ''}
                  onChange={(e) => onChange('voucherDescription', e?.target?.value)}
                  required
                />
                <Input
                  label="Estimated Value (USD)"
                  type="number"
                  placeholder="Estimated monetary value of the prize"
                  value={formData?.voucherValue || ''}
                  onChange={(e) => onChange('voucherValue', e?.target?.value)}
                />
              </div>
            )}

            {formData?.prizeType === 'projected_revenue' && (
              <div className="space-y-3">
                <Input
                  label="Projected Revenue Amount (USD)"
                  type="number"
                  placeholder="e.g. 1000000 for projected $1,000,000 revenue"
                  value={formData?.projectedRevenue || ''}
                  onChange={(e) => onChange('projectedRevenue', e?.target?.value)}
                  required
                />
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                  <p className="text-xs text-blue-700 dark:text-blue-400">
                    <Icon name="Info" size={12} className="inline mr-1" />
                    Projected revenue is distributed among winners based on the percentage breakdown below.
                  </p>
                </div>
              </div>
            )}

            <Input
              label="Number of Winners"
              type="number"
              placeholder="How many winners?"
              value={formData?.numberOfWinners}
              onChange={(e) => {
                const num = parseInt(e?.target?.value) || 1;
                onChange('numberOfWinners', num);
                // Auto-adjust winner distribution
                const newDist = Array.from({ length: num }, (_, i) => ({
                  position: i + 1,
                  percentage: winnerDistribution?.[i]?.percentage || (i === 0 ? 100 : 0)
                }));
                setWinnerDistribution(newDist);
                onChange('winnerDistribution', newDist);
              }}
              error={errors?.numberOfWinners}
              required
            />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-foreground">Winner Prize Distribution</label>
                <span
                  className={`text-xs font-semibold ${
                    Math.abs(totalPct - 100) < 0.01 ? 'text-green-600' : 'text-red-500'
                  }`}
                >
                  Total: {totalPct?.toFixed(1)}% {Math.abs(totalPct - 100) < 0.01 ? '✓' : '(must equal 100%)'}
                </span>
              </div>
              <div className="space-y-2">
                {winnerDistribution?.map((winner, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-blue-400'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-sm text-foreground flex-1">
                      {index === 0 ? '1st' : index === 1 ? '2nd' : index === 2 ? '3rd' : `${index + 1}th`} Place Winner
                    </span>
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={winner?.percentage}
                        onChange={(e) => updateWinnerPct(index, e?.target?.value)}
                        min="0"
                        max="100"
                        step="0.1"
                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-center bg-background text-foreground"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                  </div>
                ))}
              </div>
              {Math.abs(totalPct - 100) >= 0.01 && (
                <p className="text-xs text-red-500">
                  Percentages must sum to exactly 100%. Current total: {totalPct?.toFixed(1)}%
                </p>
              )}
            </div>

            <Checkbox
              label="Show Live Prize Display"
              description="Display prize pool and winner count in real-time during voting"
              checked={formData?.showLivePrizeDisplay}
              onChange={(e) => onChange('showLivePrizeDisplay', e?.target?.checked)}
            />
          </div>
        )}
      </div>
      <div className="space-y-4">
        <h4 className="text-lg font-heading font-semibold text-foreground">
          Vote Visibility Controls
        </h4>
        <Select
          label="Vote Results Visibility"
          description="Control when voters can see live vote counts"
          options={[
            { value: 'visible', label: 'Always Visible - Show live results to everyone' },
            { value: 'visible_after_vote', label: 'Visible After Voting - Show results only after user votes' },
            { value: 'hidden', label: 'Hidden Until Close - Hide results until election ends' }
          ]}
          value={formData?.voteVisibility}
          onChange={(value) => onChange('voteVisibility', value)}
          error={errors?.voteVisibility}
        />

        <Checkbox
          label="Enable Live Results Chart"
          description="Display real-time pie chart of vote distribution"
          checked={formData?.showLiveResults}
          onChange={(e) => onChange('showLiveResults', e?.target?.checked)}
        />

        <Checkbox
          label="Creator can see vote totals during election"
          description="Allow the election creator to view live vote counts while the election is open (can be changed mid-election)"
          checked={formData?.creatorCanSeeTotals !== false}
          onChange={(e) => onChange('creatorCanSeeTotals', e?.target?.checked)}
        />
      </div>
      <div className="space-y-4">
        <h4 className="text-lg font-heading font-semibold text-foreground">
          Election Schedule
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={formData?.startDate}
            onChange={(e) => onChange('startDate', e?.target?.value)}
            error={errors?.startDate}
            required
          />
          <Input
            label="Start Time"
            type="time"
            value={formData?.startTime}
            onChange={(e) => onChange('startTime', e?.target?.value)}
            error={errors?.startTime}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="End Date"
            type="date"
            value={formData?.endDate}
            onChange={(e) => onChange('endDate', e?.target?.value)}
            error={errors?.endDate}
            required
          />
          <Input
            label="End Time"
            type="time"
            value={formData?.endTime}
            onChange={(e) => onChange('endTime', e?.target?.value)}
            error={errors?.endTime}
            required
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Branding Logo
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Upload your organization logo (recommended: 200x200px, max 2MB). This will be embedded in the QR code.
        </p>

        {!formData?.brandingLogo ? (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-border rounded-xl p-6 md:p-8 hover:border-primary transition-all duration-250 bg-muted/30">
              <div className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon name="Image" size={24} color="var(--color-primary)" />
                </div>
                <div className="text-center">
                  <p className="text-sm md:text-base font-medium text-foreground">
                    Click to upload logo
                  </p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1">
                    PNG, JPG, SVG up to 2MB
                  </p>
                </div>
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative inline-block">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-xl overflow-hidden border-2 border-border bg-muted">
              <Image
                src={formData?.brandingLogo}
                alt="Organization branding logo displayed on election materials and voting interface"
                className="w-full h-full object-contain p-2"
              />
            </div>
            <button
              onClick={removeLogo}
              className="absolute -top-2 -right-2 w-8 h-8 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center hover:scale-105 transition-all duration-250 shadow-democratic-md"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        )}
      </div>
      {formData?.uniqueElectionId && formData?.electionUrl && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 md:p-6 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="CheckCircle" size={20} className="text-success" />
            <h4 className="text-sm md:text-base font-heading font-semibold text-foreground">
              Election Published - Unique Identifiers Generated
            </h4>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Unique Election ID</label>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                <code className="font-data text-sm text-foreground flex-1">{formData?.uniqueElectionId}</code>
                <button
                  onClick={() => navigator.clipboard?.writeText(formData?.uniqueElectionId)}
                  className="w-8 h-8 flex-shrink-0 rounded-lg hover:bg-muted flex items-center justify-center transition-all duration-250"
                >
                  <Icon name="Copy" size={16} />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Election URL</label>
              <div className="flex items-center gap-2 bg-muted/50 rounded-lg p-2">
                <code className="font-data text-sm text-foreground flex-1 break-all">{formData?.electionUrl}</code>
                <button
                  onClick={() => navigator.clipboard?.writeText(formData?.electionUrl)}
                  className="w-8 h-8 flex-shrink-0 rounded-lg hover:bg-muted flex items-center justify-center transition-all duration-250"
                >
                  <Icon name="Copy" size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-2 block">
                  Branded QR Code
                </label>
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <div
                    ref={qrCodeRef}
                    className="bg-white p-4 rounded-lg border border-border relative"
                  >
                    <QRCodeSVG
                      value={formData?.electionUrl}
                      size={200}
                      level="H"
                      includeMargin={true}
                    />
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                      <div className="bg-white rounded-xl shadow-md px-3 py-2 flex flex-col items-center gap-1 min-w-[96px]">
                        {formData?.brandingLogo && (
                          <div className="w-12 h-12 rounded-lg overflow-hidden border border-border bg-white flex items-center justify-center">
                            <Image
                              src={formData?.brandingLogo}
                              alt="Creator brand logo displayed at the center of the QR code"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        )}
                        <VotteryWordmark className="w-24 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-xs text-muted-foreground">
                      Share this {formData?.brandingLogo ? 'branded ' : ''}QR code on social
                      media, posters, or marketing materials. Voters can scan it to access the
                      election directly.
                    </p>
                    <button
                      onClick={downloadQRCode}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all duration-250"
                    >
                      <Icon name="Download" size={16} />
                      <span className="text-sm font-medium">
                        Download {formData?.brandingLogo ? 'Branded ' : ''}QR Code
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Icon name="MonitorPlay" size={16} className="text-primary" />
                  <p className="text-xs font-medium text-foreground">
                    Social thumbnail preview
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  This is how your QR will appear when you place it on Instagram, TikTok, or
                  YouTube thumbnails. Use it on reels, stories, and video covers to drive voters
                  directly into your election.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Instagram Reel', accent: 'bg-gradient-to-br from-pink-500 to-yellow-400' },
                    { label: 'TikTok Video', accent: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' },
                    { label: 'YouTube Thumbnail', accent: 'bg-gradient-to-br from-red-600 to-red-500' }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg bg-card shadow-sm border border-border/60 overflow-hidden"
                    >
                      <div className={`h-20 relative ${item.accent}`}>
                        <div className="absolute inset-2 flex items-end justify-end">
                          <div className="bg-white/95 rounded-lg px-2 py-1 flex flex-col items-center gap-0.5">
                            {formData?.brandingLogo && (
                              <div className="w-6 h-6 rounded bg-white overflow-hidden flex items-center justify-center border border-border/60">
                                <Image
                                  src={formData?.brandingLogo}
                                  alt={`${item.label} preview creator logo`}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <span className="text-[9px] font-semibold tracking-tight text-primary">
                              Vottery
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="px-2.5 py-1.5">
                        <p className="text-[10px] font-medium text-foreground">{item.label}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Drop this QR into your design to make voting one tap away.
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedSettingsForm;