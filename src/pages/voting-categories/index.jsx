import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Button from '../../components/ui/Button';
import { electionsService } from '../../services/electionsService';

const CATEGORY_DATA = [
{
  id: 'political',
  name: 'Political',
  description: 'Government elections, policy decisions, and political debates',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1a14240a2-1768858249343.png",
  icon: 'Landmark',
  color: 'bg-blue-500'
},
{
  id: 'community',
  name: 'Community',
  description: 'Local initiatives, neighborhood decisions, and community projects',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_18512b5dc-1766315431909.png",
  icon: 'Users',
  color: 'bg-green-500'
},
{
  id: 'corporate',
  name: 'Corporate',
  description: 'Business decisions, shareholder votes, and corporate governance',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1f6ecadf8-1767353588067.png",
  icon: 'Building2',
  color: 'bg-purple-500'
},
{
  id: 'educational',
  name: 'Educational',
  description: 'School elections, academic decisions, and student governance',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_19b64f9be-1769192238600.png",
  icon: 'GraduationCap',
  color: 'bg-indigo-500'
},
{
  id: 'social',
  name: 'Social',
  description: 'Social causes, advocacy campaigns, and public opinion polls',
  image: "https://images.unsplash.com/photo-1655578110838-9902484125fd",
  icon: 'Heart',
  color: 'bg-pink-500'
},
{
  id: 'entertainment',
  name: 'Entertainment',
  description: 'Awards, contests, fan votes, and entertainment choices',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d31595a9-1765104085765.png",
  icon: 'Music',
  color: 'bg-red-500'
},
{
  id: 'sports',
  name: 'Sports',
  description: 'Sports awards, team decisions, and athletic competitions',
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_13ed0376b-1769192238473.png",
  icon: 'Trophy',
  color: 'bg-orange-500'
},
{
  id: 'other',
  name: 'Other',
  description: 'Miscellaneous elections and unique voting opportunities',
  image: "https://images.unsplash.com/photo-1603436889709-d84a81b1403a",
  icon: 'Grid3x3',
  color: 'bg-gray-500'
}];


const VotingCategoriesPage = () => {
  const navigate = useNavigate();
  const [categoryCounts, setCategoryCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    try {
      const counts = {};
      for (const category of CATEGORY_DATA) {
        const { data } = await electionsService?.getAll({ category: category?.id, status: 'active' });
        counts[category?.id] = data?.length || 0;
      }
      setCategoryCounts(counts);
    } catch (err) {
      console.error('Error loading category counts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId) => {
    navigate(`/vote-in-elections-hub?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <ElectionsSidebar />
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                Voting Categories
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Browse elections by category and find topics that interest you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {CATEGORY_DATA?.map((category) =>
              <button
                key={category?.id}
                onClick={() => handleCategoryClick(category?.id)}
                className="group card p-0 overflow-hidden hover:shadow-democratic-lg transition-all duration-300 hover:-translate-y-1">

                  <div className="relative aspect-video overflow-hidden">
                    <Image
                    src={category?.image}
                    alt={`${category?.name} category illustration`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className={`absolute top-4 right-4 w-12 h-12 ${category?.color} rounded-full flex items-center justify-center shadow-democratic-md`}>
                      <Icon name={category?.icon} size={24} color="white" />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {category?.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {category?.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name="Vote" size={16} className="text-primary" />
                        <span className="text-sm text-muted-foreground">
                          {loading ?
                        <span className="inline-block w-8 h-4 bg-muted animate-pulse rounded" /> :

                        `${categoryCounts?.[category?.id] || 0} active`
                        }
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-primary group-hover:gap-2 transition-all">
                        <span className="text-sm font-medium">Browse</span>
                        <Icon name="ArrowRight" size={16} />
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Icon name="TrendingUp" size={24} color="var(--color-primary)" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Trending Elections
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Discover the most popular elections across all categories
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/vote-in-elections-hub?sort=trending')}>

                  View Trending
                  <Icon name="ArrowRight" size={16} />
                </Button>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mb-4">
                  <Icon name="Gift" size={24} color="var(--color-accent)" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Gamified Elections
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Vote and win prizes in lotterized elections
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/vote-in-elections-hub?lotterized=true')}>

                  View Prizes
                  <Icon name="ArrowRight" size={16} />
                </Button>
              </div>

              <div className="card p-6">
                <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mb-4">
                  <Icon name="Clock" size={24} color="var(--color-success)" />
                </div>
                <h3 className="text-lg font-heading font-bold text-foreground mb-2">
                  Ending Soon
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Don't miss out on elections closing soon
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/vote-in-elections-hub?sort=ending-soon')}>

                  View Closing
                  <Icon name="ArrowRight" size={16} />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>);

};

export default VotingCategoriesPage;