import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    try {
      const { data, error } = await electionsService?.getAll();
      if (error) throw new Error(error.message);
      setElections(data || []);
    } catch (error) {
      console.error('Failed to load elections:', error);
    } finally {
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
    <div className="min-h-screen bg-background">
      <HeaderNavigation />
      <div className="flex">
        <ElectionsSidebar />
        
        <main className="flex-1 min-w-0">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
            <div className="mb-6 md:mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-3">
                Vote in Elections Hub
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Discover and participate in elections across multiple categories with real-time results and lottery prizes
              </p>
            </div>

            <div className="mb-6">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search elections by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            {featuredElections?.length > 0 && (
              <div className="mb-8">
                <FeaturedElectionsCarousel elections={featuredElections} />
              </div>
            )}

            <div className="mb-6">
              <CategoryBrowser 
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </div>

            <div className="mb-6">
              <FilterPanel
                selectedFilter={selectedFilter}
                onSelectFilter={setSelectedFilter}
              />
            </div>

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground">
                {selectedCategory === 'all' ? 'All Elections' : `${selectedCategory?.charAt(0)?.toUpperCase() + selectedCategory?.slice(1)} Elections`}
              </h2>
              <span className="text-sm text-muted-foreground">
                {filteredElections?.length} {filteredElections?.length === 1 ? 'election' : 'elections'} found
              </span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Icon name="Loader" size={32} className="animate-spin text-primary" />
              </div>
            ) : filteredElections?.length === 0 ? (
              <div className="card p-12 text-center">
                <Icon name="Inbox" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                  No Elections Found
                </h3>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              <ElectionDiscoveryPanel elections={filteredElections} />
            )}

            {trendingElections?.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl md:text-2xl font-heading font-semibold text-foreground mb-4">
                  Trending Elections
                </h2>
                <ElectionDiscoveryPanel elections={trendingElections} />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VoteInElectionsHub;