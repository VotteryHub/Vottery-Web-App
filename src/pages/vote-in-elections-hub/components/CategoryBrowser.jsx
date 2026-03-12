import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryBrowser = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="card p-4 md:p-6">
      <h3 className="text-lg font-heading font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="Grid" size={20} className="text-primary" />
        Browse by Category
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3">
        {categories?.map((category) => {
          const isSelected = selectedCategory === category?.id;
          return (
            <button
              key={category?.id}
              onClick={() => onSelectCategory(category?.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-250 ${
                isSelected
                  ? 'border-primary bg-primary/10' :'border-border bg-card hover:border-primary/50 hover:bg-muted'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  isSelected ? 'bg-primary/20' : 'bg-muted'
                }`}>
                  <Icon 
                    name={category?.icon} 
                    size={24} 
                    color={isSelected ? 'var(--color-primary)' : 'var(--color-muted-foreground)'}
                  />
                </div>
                <div className="text-center">
                  <p className={`text-sm font-medium ${
                    isSelected ? 'text-primary' : 'text-foreground'
                  }`}>
                    {category?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {category?.count} {category?.count === 1 ? 'election' : 'elections'}
                  </p>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryBrowser;