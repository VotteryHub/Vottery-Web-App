import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
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
    <GeneralPageLayout title="Voting Categories" showSidebar={true}>
      <div className="w-full py-0">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3 tracking-tight">
                Voting Categories
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-medium">
                Browse elections by category and find topics that interest you
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {CATEGORY_DATA?.map((category) =>
              <button
                key={category?.id}
                onClick={() => handleCategoryClick(category?.id)}
                className="group premium-glass p-0 overflow-hidden hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 border border-white/10 rounded-3xl">

                  <div className="relative aspect-video overflow-hidden">
                    <Image
                    src={category?.image}
                    alt={`${category?.name} category illustration`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className={`absolute top-4 right-4 w-12 h-12 ${category?.color} rounded-2xl flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform`}>
                      <Icon name={category?.icon} size={24} color="white" />
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-heading font-black text-white mb-2 group-hover:text-primary transition-colors uppercase tracking-tight">
                      {category?.name}
                    </h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 font-medium">
                      {category?.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Icon name="Vote" size={14} className="text-primary" />
                        <span className="text-xs font-bold text-slate-300">
                          {loading ?
                        <span className="inline-block w-8 h-3 bg-white/10 animate-pulse rounded" /> :

                        `${categoryCounts?.[category?.id] || 0} active`
                        }
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-primary group-hover:gap-3 transition-all">
                        <span className="text-xs font-black uppercase tracking-widest">Browse</span>
                        <Icon name="ArrowRight" size={14} />
                      </div>
                    </div>
                  </div>
                </button>
              )}
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="premium-glass p-8 rounded-3xl border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6 border border-primary/20">
                  <Icon name="TrendingUp" size={28} className="text-primary" />
                </div>
                <h3 className="text-xl font-heading font-black text-white mb-3 uppercase tracking-tight">
                  Trending Elections
                </h3>
                <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">
                  Discover the most popular elections across all categories and join the global conversation.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                  onClick={() => navigate('/vote-in-elections-hub?sort=trending')}>

                  View Trending
                  <Icon name="ArrowRight" size={14} className="ml-2" />
                </Button>
              </div>

              <div className="premium-glass p-8 rounded-3xl border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 border border-accent/20">
                  <Icon name="Gift" size={28} className="text-accent" />
                </div>
                <h3 className="text-xl font-heading font-black text-white mb-3 uppercase tracking-tight">
                  Gamified Elections
                </h3>
                <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">
                  Vote and win exclusive rewards in our unique lotterized elections with blockchain transparency.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                  onClick={() => navigate('/vote-in-elections-hub?lotterized=true')}>

                  View Prizes
                  <Icon name="ArrowRight" size={14} className="ml-2" />
                </Button>
              </div>

              <div className="premium-glass p-8 rounded-3xl border border-white/5 shadow-xl hover:bg-white/5 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-success/10 flex items-center justify-center mb-6 border border-success/20">
                  <Icon name="Clock" size={28} className="text-success" />
                </div>
                <h3 className="text-xl font-heading font-black text-white mb-3 uppercase tracking-tight">
                  Ending Soon
                </h3>
                <p className="text-sm text-slate-400 mb-6 font-medium leading-relaxed">
                  Don't miss your chance to impact the results of elections closing in the next few hours.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-xl font-black uppercase tracking-widest text-[10px]"
                  onClick={() => navigate('/vote-in-elections-hub?sort=ending-soon')}>

                  View Closing
                  <Icon name="ArrowRight" size={14} className="ml-2" />
                </Button>
              </div>
            </div>
      </div>
    </GeneralPageLayout>
  );
};

export default VotingCategoriesPage;