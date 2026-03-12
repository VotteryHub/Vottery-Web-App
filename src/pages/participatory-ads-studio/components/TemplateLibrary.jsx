import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';

const TemplateLibrary = ({ onSelectTemplate, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const templates = [
  {
    id: 1,
    name: 'Product Feedback Survey',
    category: 'market_research',
    description: 'Gather customer opinions on product features and improvements',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_194625d93-1772217102353.png",
    imageAlt: 'Modern office workspace with laptop showing product analytics dashboard and colorful charts on screen',
    questions: 3,
    estimatedTime: '2 min',
    popularity: 'High'
  },
  {
    id: 2,
    name: 'Brand Awareness Campaign',
    category: 'brand_awareness',
    description: 'Increase brand visibility and measure recognition',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1c2e67d4f-1767095336985.png",
    imageAlt: 'Professional business team collaborating around conference table with brand strategy documents and laptops',
    questions: 4,
    estimatedTime: '3 min',
    popularity: 'Very High'
  },
  {
    id: 3,
    name: 'New Product Launch Hype',
    category: 'product_launch',
    description: 'Generate excitement for upcoming product releases',
    image: "https://images.unsplash.com/photo-1648101481676-5d4a97350032",
    imageAlt: 'Sleek modern smartphone product photography on minimalist white background with dramatic lighting',
    questions: 5,
    estimatedTime: '4 min',
    popularity: 'High'
  },
  {
    id: 4,
    name: 'CSR Initiative Voting',
    category: 'csr_initiative',
    description: 'Let community choose your next social responsibility project',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f5c4982e-1765612617526.png",
    imageAlt: 'Diverse group of volunteers planting trees in urban community garden with green plants and soil',
    questions: 3,
    estimatedTime: '2 min',
    popularity: 'Medium'
  },
  {
    id: 5,
    name: 'Trend Prediction Poll',
    category: 'hype_prediction',
    description: 'Gauge interest in emerging trends and innovations',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ce42dfc3-1766760009915.png",
    imageAlt: 'Futuristic digital interface with glowing data visualization graphs and trend analysis charts',
    questions: 4,
    estimatedTime: '3 min',
    popularity: 'High'
  },
  {
    id: 6,
    name: 'Customer Satisfaction Study',
    category: 'customer_feedback',
    description: 'Measure satisfaction and identify improvement areas',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1180d1bba-1772164117285.png",
    imageAlt: 'Happy customer service representative with headset smiling at computer screen in modern office',
    questions: 6,
    estimatedTime: '5 min',
    popularity: 'Very High'
  },
  {
    id: 7,
    name: 'Feature Prioritization Vote',
    category: 'market_research',
    description: 'Let users vote on which features to build next',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1137a0813-1772141569660.png",
    imageAlt: 'Software development team reviewing feature roadmap on large monitor with sticky notes and diagrams',
    questions: 4,
    estimatedTime: '3 min',
    popularity: 'Medium'
  },
  {
    id: 8,
    name: 'Sustainability Commitment',
    category: 'csr_initiative',
    description: 'Engage audience in environmental responsibility decisions',
    image: "https://images.unsplash.com/photo-1687067376543-38635680f22e",
    imageAlt: 'Hands holding small green plant seedling with soil against blurred natural background',
    questions: 3,
    estimatedTime: '2 min',
    popularity: 'High'
  }];


  const categories = [
  { value: 'all', label: 'All Templates', icon: 'LayoutGrid' },
  { value: 'market_research', label: 'Market Research', icon: 'BarChart3' },
  { value: 'brand_awareness', label: 'Brand Awareness', icon: 'TrendingUp' },
  { value: 'product_launch', label: 'Product Launch', icon: 'Rocket' },
  { value: 'csr_initiative', label: 'CSR Initiative', icon: 'Heart' },
  { value: 'hype_prediction', label: 'Hype Prediction', icon: 'Zap' },
  { value: 'customer_feedback', label: 'Customer Feedback', icon: 'MessageSquare' }];


  const filteredTemplates = templates?.filter((template) => {
    const matchesSearch = template?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    template?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template?.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getPopularityColor = (popularity) => {
    switch (popularity) {
      case 'Very High':return 'text-success';
      case 'High':return 'text-primary';
      case 'Medium':return 'text-warning';
      default:return 'text-muted-foreground';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-modal flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-border">
          <div>
            <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">Template Library</h2>
            <p className="text-sm text-muted-foreground mt-1">Choose a pre-built campaign template to get started quickly</p>
          </div>
          <Button variant="ghost" size="icon" iconName="X" onClick={onClose} />
        </div>

        <div className="p-4 md:p-6 border-b border-border space-y-4">
          <Input
            type="search"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)} />


          <div className="flex flex-wrap gap-2">
            {categories?.map((category) =>
            <button
              key={category?.value}
              onClick={() => setSelectedCategory(category?.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-250 ${
              selectedCategory === category?.value ?
              'bg-primary text-primary-foreground' :
              'bg-muted text-foreground hover:bg-muted/80'}`
              }>

                <Icon name={category?.icon} size={16} />
                {category?.label}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-6">
          {filteredTemplates?.length === 0 ?
          <div className="text-center py-12">
              <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
              <p className="text-foreground font-medium mb-2">No templates found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div> :

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredTemplates?.map((template) =>
            <div
              key={template?.id}
              className="bg-background border border-border rounded-lg overflow-hidden hover:border-primary transition-all duration-250 cursor-pointer group"
              onClick={() => onSelectTemplate(template)}>

                  <div className="relative h-40 overflow-hidden">
                    <Image
                  src={template?.image}
                  alt={template?.imageAlt}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-250" />

                    <div className="absolute top-2 right-2">
                      <div className={`px-2 py-1 rounded-full text-xs font-medium bg-background/90 ${getPopularityColor(template?.popularity)}`}>
                        {template?.popularity}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-heading font-semibold text-foreground mb-1 line-clamp-1">
                        {template?.name}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {template?.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Icon name="FileQuestion" size={14} />
                        {template?.questions} questions
                      </span>
                      <span className="flex items-center gap-1">
                        <Icon name="Clock" size={14} />
                        {template?.estimatedTime}
                      </span>
                    </div>

                    <Button variant="outline" size="sm" fullWidth iconName="ArrowRight" iconPosition="right">
                      Use Template
                    </Button>
                  </div>
                </div>
            )}
            </div>
          }
        </div>
      </div>
    </div>);

};

export default TemplateLibrary;