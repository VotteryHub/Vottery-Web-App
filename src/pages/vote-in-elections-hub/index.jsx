import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GeneralPageLayout from '../../components/layout/GeneralPageLayout';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import ElectionsSidebar from '../../components/ui/ElectionsSidebar';
import CategoryBrowser from './components/CategoryBrowser';
import ElectionDiscoveryPanel from './components/ElectionDiscoveryPanel';
import FeaturedElectionsCarousel from './components/FeaturedElectionsCarousel';
import FilterPanel from './components/FilterPanel';
import Icon from '../../components/AppIcon';
import { electionsService } from '../../services/electionsService';
import { useAuth } from '../../contexts/AuthContext';

const VoteInElectionsHub = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [elections, setElections] = useState([]);
  const [filteredElections, setFilteredElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadElections();
    const unsubscribe = electionsService?.subscribeToElections(() => {
      loadElections();
    });
    return () => unsubscribe?.();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [elections, selectedCategory, selectedFilter, searchQuery]);

  const loadElections = async () => {
    // Guard: ensure loading never hangs longer than 10 seconds
    const timeout = setTimeout(() => {
      console.warn('[VoteInElectionsHub] Elections fetch timed out — clearing loader.');
      setLoading(false);
    }, 10000);

    try {
      console.log('[VoteInElectionsHub] Fetching elections...');
      const { data, error } = await electionsService?.getAll();
      if (error) {
        console.error('[VoteInElectionsHub] Service error:', error);
        // Still show empty state instead of hanging
        setElections([]);
      } else {
        console.log('[VoteInElectionsHub] Loaded', data?.length ?? 0, 'elections.');
        setElections(data || []);
      }
    } catch (err) {
      console.error('[VoteInElectionsHub] Unexpected error loading elections:', err);
      setElections([]);
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...elections];

    if (selectedCategory !== 'all') {
      filtered = filtered?.filter(e => e?.category?.toLowerCase() === selectedCategory?.toLowerCase());
    }

    if (selectedFilter === 'active') {
      filtered = filtered?.filter(e => e?.status === 'active');
    } else if (selectedFilter === 'lotterized') {
      filtered = filtered?.filter(e => e?.isLotterized === true);
    } else if (selectedFilter === 'upcoming') {
      filtered = filtered?.filter(e => e?.status === 'upcoming');
    } else if (selectedFilter === 'free') {
      filtered = filtered?.filter(e => e?.entryFee === 'Free');
    } else if (selectedFilter === 'high-prize') {
      // Filter elections with prize pool > $1000
      filtered = filtered?.filter(e => {
        const prizeValue = parseFloat(e?.prizePool?.replace(/[^0-9.]/g, ''));
        return prizeValue > 1000;
      });
    } else if (selectedFilter === 'trending') {
      // Filter trending elections (high voter count)
      filtered = filtered?.filter(e => e?.totalVoters > 500)?.sort((a, b) => b?.totalVoters - a?.totalVoters);
    } else if (selectedFilter === 'verified-creators') {
      // Filter elections from verified creators
      filtered = filtered?.filter(e => e?.creatorVerified === true);
    }

    if (searchQuery) {
      filtered = filtered?.filter(e => 
        e?.title?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        e?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        e?.category?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    setFilteredElections(filtered);
  };

  const categories = [
    { id: 'all', name: 'All Elections', icon: 'Grid', count: elections?.length },
    { id: 'politics', name: 'Politics', icon: 'Vote', count: elections?.filter(e => e?.category === 'Politics')?.length },
    { id: 'technology', name: 'Technology', icon: 'Cpu', count: elections?.filter(e => e?.category === 'Technology')?.length },
    { id: 'sports', name: 'Sports', icon: 'Trophy', count: elections?.filter(e => e?.category === 'Sports')?.length },
    { id: 'entertainment', name: 'Entertainment', icon: 'Film', count: elections?.filter(e => e?.category === 'Entertainment')?.length },
    { id: 'business', name: 'Business', icon: 'Briefcase', count: elections?.filter(e => e?.category === 'Business')?.length },
    { id: 'social issues', name: 'Social Issues', icon: 'Users', count: elections?.filter(e => e?.category === 'Social Issues')?.length }
  ];

  const featuredElections = elections?.filter(e => e?.isLotterized && e?.status === 'active')?.slice(0, 5);
  const trendingElections = elections?.filter(e => e?.totalVoters > 1000 && e?.status === 'active')?.slice(0, 8);

  return (
    <GeneralPageLayout title="Vote in Elections Hub" showSidebar={false}>
      <div className="flex flex-col lg:flex-row gap-8">
        <ElectionsSidebar />
        
        <main className="flex-1 min-w-0">
          <div className="w-full py-0">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3 tracking-tight">
                Vote in Elections Hub
              </h1>
              <p className="text-base md:text-lg text-muted-foreground font-medium">
                Discover and participate in elections across multiple categories with real-time results and lottery prizes
              </p>
            </div>

            <div className="mb-8 relative group">
              <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
                <Icon name="Search" size={20} className="text-slate-500 group-focus-within:text-primary transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search elections by title or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e?.target?.value)}
                className="w-full pl-14 pr-6 py-5 bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 font-medium transition-all shadow-inner"
              />
            </div>

            {featuredElections?.length > 0 && (
              <div className="mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                <FeaturedElectionsCarousel elections={featuredElections} />
              </div>
            )}

            <div className="mb-8 animate-in fade-in duration-500">
              <CategoryBrowser 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            <div className="mb-8 animate-in fade-in duration-500">
              <FilterPanel
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
              />
            </div>

            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">
                  {selectedCategory === 'all' ? 'All Elections' : `${selectedCategory?.charAt(0)?.toUpperCase() + selectedCategory?.slice(1)} Elections`}
                </h2>
                <div className="h-1 w-8 bg-primary rounded-full" />
              </div>
              <span className="text-xs font-black uppercase tracking-widest text-slate-500 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                {filteredElections?.length} {filteredElections?.length === 1 ? 'election' : 'elections'} found
              </span>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-b-primary animate-spin" />
                <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing Elections...</p>
              </div>
            ) : filteredElections?.length === 0 ? (
              <div className="bg-slate-900/20 rounded-3xl border border-white/5 p-20 text-center shadow-inner">
                <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Icon name="Inbox" size={32} className="text-slate-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">
                  No Elections Found
                </h3>
                <p className="text-slate-500 font-medium">
                  Try adjusting your filters or search query to find what you're looking for.
                </p>
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <ElectionDiscoveryPanel elections={filteredElections} />
              </div>
            )}

            {trendingElections?.length > 0 && (
              <div className="mt-16 pt-16 border-t border-white/5">
                <div className="flex items-center gap-3 mb-8">
                  <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                    Trending Elections
                  </h2>
                  <div className="h-1.5 w-12 bg-accent rounded-full animate-pulse" />
                </div>
                <ElectionDiscoveryPanel elections={trendingElections} />
              </div>
            )}
          </div>
        </main>
      </div>
    </GeneralPageLayout>
  );
};

export default VoteInElectionsHub;