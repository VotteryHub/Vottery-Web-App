import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ButtonStyles = () => {
  const variants = [
    { name: 'Default', variant: 'default', description: 'Primary actions and CTAs' },
    { name: 'Secondary', variant: 'secondary', description: 'Secondary actions' },
    { name: 'Outline', variant: 'outline', description: 'Tertiary actions' },
    { name: 'Ghost', variant: 'ghost', description: 'Subtle actions' },
    { name: 'Success', variant: 'success', description: 'Positive confirmations' },
    { name: 'Warning', variant: 'warning', description: 'Caution actions' },
    { name: 'Danger', variant: 'danger', description: 'Destructive actions' }
  ];

  const sizes = [
    { name: 'Extra Small', size: 'xs' },
    { name: 'Small', size: 'sm' },
    { name: 'Default', size: 'default' },
    { name: 'Large', size: 'lg' },
    { name: 'Extra Large', size: 'xl' }
  ];

  return (
    <div className="space-y-8">
      {/* Variants */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Button Variants
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Different visual styles for various action hierarchies
        </p>
        <div className="space-y-6">
          {variants?.map((v) => (
            <div key={v?.variant} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {v?.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{v?.description}</p>
                </div>
                <Button variant={v?.variant}>{v?.name} Button</Button>
              </div>
              <div className="flex gap-3 flex-wrap">
                <Button variant={v?.variant} iconName="Check" iconPosition="left">
                  With Icon Left
                </Button>
                <Button variant={v?.variant} iconName="ArrowRight" iconPosition="right">
                  With Icon Right
                </Button>
                <Button variant={v?.variant} iconName="Heart" size="icon" />
                <Button variant={v?.variant} disabled>
                  Disabled
                </Button>
                <Button variant={v?.variant} loading>
                  Loading
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sizes */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Button Sizes
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Consistent sizing scale for different contexts
        </p>
        <div className="flex items-end gap-4 flex-wrap">
          {sizes?.map((s) => (
            <div key={s?.size} className="flex flex-col items-center gap-2">
              <Button size={s?.size}>{s?.name}</Button>
              <span className="text-xs text-gray-600 dark:text-gray-400">{s?.size}</span>
            </div>
          ))}
        </div>
      </div>

      {/* States */}
      <div className="card p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          Interactive States
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Hover, active, focus, and disabled states
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Default State</h3>
            <Button>Hover over me</Button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Disabled State</h3>
            <Button disabled>Cannot interact</Button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Loading State</h3>
            <Button loading>Processing...</Button>
          </div>
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Full Width</h3>
            <Button fullWidth>Full Width Button</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ButtonStyles;