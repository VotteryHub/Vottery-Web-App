import React from 'react';


const ColorTokens = () => {
  const colorGroups = [
    {
      title: 'Primary Colors',
      description: 'Democratic authority and trust-building',
      colors: [
        { name: 'Primary', var: '--color-primary', class: 'bg-primary', textClass: 'text-primary-foreground' },
        { name: 'Primary Foreground', var: '--color-primary-foreground', class: 'bg-primary-foreground', textClass: 'text-primary' }
      ]
    },
    {
      title: 'Secondary Colors',
      description: 'Innovation and blockchain technology',
      colors: [
        { name: 'Secondary', var: '--color-secondary', class: 'bg-secondary', textClass: 'text-secondary-foreground' },
        { name: 'Secondary Foreground', var: '--color-secondary-foreground', class: 'bg-secondary-foreground', textClass: 'text-secondary' }
      ]
    },
    {
      title: 'Accent Colors',
      description: 'Reward energy and lottery excitement',
      colors: [
        { name: 'Accent', var: '--color-accent', class: 'bg-accent', textClass: 'text-accent-foreground' },
        { name: 'Accent Foreground', var: '--color-accent-foreground', class: 'bg-accent-foreground', textClass: 'text-accent' }
      ]
    },
    {
      title: 'Semantic Colors',
      description: 'Status and feedback indicators',
      colors: [
        { name: 'Success', var: '--color-success', class: 'bg-success', textClass: 'text-success-foreground' },
        { name: 'Warning', var: '--color-warning', class: 'bg-warning', textClass: 'text-warning-foreground' },
        { name: 'Error', var: '--color-error', class: 'bg-error', textClass: 'text-error-foreground' }
      ]
    },
    {
      title: 'Surface Colors',
      description: 'Backgrounds and containers',
      colors: [
        { name: 'Background', var: '--color-background', class: 'bg-background', textClass: 'text-foreground' },
        { name: 'Foreground', var: '--color-foreground', class: 'bg-foreground', textClass: 'text-background' },
        { name: 'Card', var: '--color-card', class: 'bg-card', textClass: 'text-card-foreground' },
        { name: 'Muted', var: '--color-muted', class: 'bg-muted', textClass: 'text-muted-foreground' }
      ]
    }
  ];

  return (
    <div className="space-y-8">
      {colorGroups?.map((group) => (
        <div key={group?.title} className="card p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {group?.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">{group?.description}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {group?.colors?.map((color) => (
              <div key={color?.name} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <div className={`${color?.class} ${color?.textClass} h-32 flex items-center justify-center font-semibold text-lg`}>
                  {color?.name}
                </div>
                <div className="p-4 bg-white dark:bg-gray-800">
                  <p className="font-mono text-sm text-gray-900 dark:text-gray-100 mb-1">
                    {color?.var}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Tailwind: <code className="bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded">{color?.class}</code>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ColorTokens;