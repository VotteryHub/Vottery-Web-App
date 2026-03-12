import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from 'react-helmet';
import { Handshake, Search, FileText, DollarSign, TrendingUp, Award, Filter, Plus } from 'lucide-react';
import LeftSidebar from '../../components/ui/LeftSidebar';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { creatorBrandPartnershipService } from '../../services/creatorBrandPartnershipService';
import { AuthContext } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const CreatorBrandPartnershipPortal = () => {
  const { user } = React.useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [opportunities, setOpportunities] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [filters, setFilters] = useState({
    industry: '',
    contentType: '',
    minBudget: ''
  });

  useEffect(() => {
    loadData();
  }, [activeTab, user]);

  const loadData = async () => {
    try {
      setLoading(true);

      if (activeTab === 'discover') {
        const result = await creatorBrandPartnershipService?.discoverOpportunities(filters);
        if (result?.data) setOpportunities(result?.data);
      } else if (activeTab === 'proposals') {
        const result = await creatorBrandPartnershipService?.getCreatorProposals(user?.id);
        if (result?.data) setProposals(result?.data);
      } else if (activeTab === 'contracts') {
        const result = await creatorBrandPartnershipService?.getCreatorContracts(user?.id);
        if (result?.data) setContracts(result?.data);
      } else if (activeTab === 'analytics') {
        const result = await creatorBrandPartnershipService?.getPartnershipAnalytics(user?.id);
        if (result?.data) setAnalytics(result?.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast?.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'discover', label: 'Discover Brands', icon: Search },
    { id: 'proposals', label: 'My Proposals', icon: FileText },
    { id: 'contracts', label: 'Active Contracts', icon: Handshake },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp }
  ];

  return (
    <>
      <Helmet>
        <title>Creator Brand Partnership Portal | Discover & Collaborate</title>
        <meta name="description" content="Connect with brands for sponsored content opportunities, manage proposals, and negotiate revenue-share deals" />
      </Helmet>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <LeftSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderNavigation />
          
          <main className="flex-1 overflow-y-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                      <Icon icon={Handshake} className="w-8 h-8 text-purple-600" />
                      Creator Brand Partnership Portal
                    </h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      Discover brand opportunities, submit proposals, and manage sponsored content partnerships
                    </p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm mb-6">
                <div className="border-b border-gray-200 dark:border-gray-700">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {tabs?.map((tab) => {
                      const TabIcon = tab?.icon;
                      return (
                        <button
                          key={tab?.id}
                          onClick={() => setActiveTab(tab?.id)}
                          className={`
                            py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors
                            ${activeTab === tab?.id
                              ? 'border-purple-500 text-purple-600 dark:text-purple-400' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                            }
                          `}
                        >
                          <TabIcon size={18} />
                          {tab?.label}
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
                  </div>
                ) : (
                  <>
                    {activeTab === 'discover' && (
                      <DiscoverPanel 
                        opportunities={opportunities} 
                        filters={filters}
                        setFilters={setFilters}
                        onRefresh={loadData}
                      />
                    )}
                    {activeTab === 'proposals' && (
                      <ProposalsPanel proposals={proposals} onRefresh={loadData} />
                    )}
                    {activeTab === 'contracts' && (
                      <ContractsPanel contracts={contracts} onRefresh={loadData} />
                    )}
                    {activeTab === 'analytics' && (
                      <AnalyticsPanel analytics={analytics} />
                    )}
                  </>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// Discover Panel
const DiscoverPanel = ({ opportunities, filters, setFilters, onRefresh }) => {
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showProposalModal, setShowProposalModal] = useState(false);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon={Filter} className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Opportunities</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Industry
            </label>
            <select
              value={filters?.industry}
              onChange={(e) => setFilters({ ...filters, industry: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Industries</option>
              <option value="technology">Technology</option>
              <option value="fashion">Fashion</option>
              <option value="food">Food & Beverage</option>
              <option value="fitness">Fitness & Health</option>
              <option value="gaming">Gaming</option>
              <option value="beauty">Beauty</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Content Type
            </label>
            <select
              value={filters?.contentType}
              onChange={(e) => setFilters({ ...filters, contentType: e?.target?.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="">All Types</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="article">Article</option>
              <option value="election">Election</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Min Budget
            </label>
            <input
              type="number"
              value={filters?.minBudget}
              onChange={(e) => setFilters({ ...filters, minBudget: e?.target?.value })}
              placeholder="$0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={onRefresh} variant="primary" iconName="Search">
            Apply Filters
          </Button>
        </div>
      </div>

      {/* Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities?.map((opp) => (
          <div key={opp?.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {opp?.brandProfiles?.logoUrl && (
                  <img src={opp?.brandProfiles?.logoUrl} alt={opp?.brandProfiles?.companyName} className="w-12 h-12 rounded-full object-cover" />
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{opp?.brandProfiles?.companyName}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{opp?.brandProfiles?.industry}</p>
                </div>
              </div>
              {opp?.brandProfiles?.verified && (
                <Icon icon={Award} className="w-5 h-5 text-blue-600" />
              )}
            </div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{opp?.title}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{opp?.description}</p>
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Budget Range:</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  ${opp?.budgetMin?.toLocaleString()} - ${opp?.budgetMax?.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Content Type:</span>
                <span className="font-semibold text-gray-900 dark:text-white capitalize">{opp?.contentType}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">Applications:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{opp?.applicationsCount}</span>
              </div>
            </div>
            <Button 
              onClick={() => {
                setSelectedOpportunity(opp);
                setShowProposalModal(true);
              }}
              variant="primary" 
              className="w-full"
              iconName="Plus"
            >
              Submit Proposal
            </Button>
          </div>
        ))}
      </div>

      {opportunities?.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Icon icon={Search} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No opportunities found. Try adjusting your filters.</p>
        </div>
      )}

      {showProposalModal && (
        <ProposalModal 
          opportunity={selectedOpportunity}
          onClose={() => {
            setShowProposalModal(false);
            setSelectedOpportunity(null);
          }}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};

// Proposals Panel
const ProposalsPanel = ({ proposals, onRefresh }) => {
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [showNegotiationModal, setShowNegotiationModal] = useState(false);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
      under_review: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      accepted: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
      negotiating: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
    };
    return colors?.[status] || colors?.pending;
  };

  return (
    <div className="space-y-4">
      {proposals?.map((proposal) => (
        <div key={proposal?.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {proposal?.partnershipOpportunities?.title}
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal?.status)}`}>
                  {proposal?.status?.replace('_', ' ')?.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Brand: {proposal?.brandProfiles?.companyName}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Proposed Budget</p>
              <p className="text-xl font-bold text-gray-900 dark:text-white">
                ${proposal?.proposedBudget?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-4">
            <p className="text-sm text-gray-700 dark:text-gray-300">{proposal?.proposalText}</p>
          </div>

          {proposal?.brandResponse && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 mb-4">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">Brand Response:</p>
              <p className="text-sm text-blue-800 dark:text-blue-400">{proposal?.brandResponse}</p>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Submitted {new Date(proposal?.createdAt)?.toLocaleDateString()}
            </p>
            {proposal?.status === 'accepted' && (
              <Button 
                onClick={() => {
                  setSelectedProposal(proposal);
                  setShowNegotiationModal(true);
                }}
                variant="primary"
                iconName="DollarSign"
              >
                Negotiate Terms
              </Button>
            )}
          </div>
        </div>
      ))}

      {proposals?.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Icon icon={FileText} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No proposals yet. Start by discovering brand opportunities!</p>
        </div>
      )}

      {showNegotiationModal && (
        <NegotiationModal 
          proposal={selectedProposal}
          onClose={() => {
            setShowNegotiationModal(false);
            setSelectedProposal(null);
          }}
          onSuccess={onRefresh}
        />
      )}
    </div>
  );
};

// Contracts Panel
const ContractsPanel = ({ contracts, onRefresh }) => {
  return (
    <div className="space-y-4">
      {contracts?.map((contract) => (
        <div key={contract?.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Partnership with {contract?.brandProfiles?.companyName}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                <span>Start: {new Date(contract?.startDate)?.toLocaleDateString()}</span>
                <span>•</span>
                <span>End: {new Date(contract?.endDate)?.toLocaleDateString()}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Value</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${contract?.totalValue?.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Your Share</p>
              <p className="text-xl font-bold text-green-600 dark:text-green-400">
                {contract?.revenueSplit?.creator}%
              </p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Brand Share</p>
              <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {contract?.revenueSplit?.brand}%
              </p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Platform Fee</p>
              <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {contract?.revenueSplit?.platform}%
              </p>
            </div>
          </div>

          {contract?.partnershipDeliverables?.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Deliverables</h4>
              <div className="space-y-2">
                {contract?.partnershipDeliverables?.map((deliverable) => (
                  <div key={deliverable?.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{deliverable?.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Due: {new Date(deliverable?.dueDate)?.toLocaleDateString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      deliverable?.status === 'approved' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                      deliverable?.status === 'submitted'? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-400'
                    }`}>
                      {deliverable?.status?.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}

      {contracts?.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
          <Icon icon={Handshake} className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">No active contracts yet.</p>
        </div>
      )}
    </div>
  );
};

// Analytics Panel
const AnalyticsPanel = ({ analytics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon icon={FileText} className="w-8 h-8 text-blue-600" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.totalProposals || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Proposals</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon icon={Award} className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.acceptedProposals || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Accepted Proposals</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon icon={Handshake} className="w-8 h-8 text-purple-600" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {analytics?.activeContracts || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Active Contracts</p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-2">
            <Icon icon={DollarSign} className="w-8 h-8 text-green-600" />
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              ${analytics?.totalEarnings?.toLocaleString() || 0}
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Earnings</p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Success Rate</h3>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Acceptance Rate</span>
              <span className="text-sm font-semibold text-gray-900 dark:text-white">
                {analytics?.totalProposals > 0 
                  ? ((analytics?.acceptedProposals / analytics?.totalProposals) * 100)?.toFixed(1)
                  : 0
                }%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ 
                  width: `${analytics?.totalProposals > 0 
                    ? (analytics?.acceptedProposals / analytics?.totalProposals) * 100 
                    : 0
                  }%` 
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Proposal Modal
const ProposalModal = ({ opportunity, onClose, onSuccess }) => {
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    proposalText: '',
    proposedBudget: opportunity?.budgetMin || 0,
    proposedTimeline: '',
    deliverables: []
  });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const result = await creatorBrandPartnershipService?.submitProposal({
        opportunityId: opportunity?.id,
        creatorId: user?.id,
        ...formData
      });

      if (result?.error) throw new Error(result?.error?.message);

      toast?.success('Proposal submitted successfully!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error submitting proposal:', error);
      toast?.error(error?.message || 'Failed to submit proposal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Submit Proposal</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{opportunity?.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Proposal Description
            </label>
            <textarea
              value={formData?.proposalText}
              onChange={(e) => setFormData({ ...formData, proposalText: e?.target?.value })}
              rows={6}
              required
              placeholder="Describe your approach, experience, and why you're the best fit for this partnership..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Proposed Budget ($)
              </label>
              <input
                type="number"
                value={formData?.proposedBudget}
                onChange={(e) => setFormData({ ...formData, proposedBudget: parseFloat(e?.target?.value) })}
                min={opportunity?.budgetMin}
                max={opportunity?.budgetMax}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeline
              </label>
              <input
                type="text"
                value={formData?.proposedTimeline}
                onChange={(e) => setFormData({ ...formData, proposedTimeline: e?.target?.value })}
                placeholder="e.g., 2 weeks"
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Proposal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Negotiation Modal
const NegotiationModal = ({ proposal, onClose, onSuccess }) => {
  const { user } = React.useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    creatorSharePercentage: 70,
    brandSharePercentage: 20,
    platformFeePercentage: 10,
    totalBudget: proposal?.proposedBudget || 0,
    paymentTerms: '',
    proposedBy: 'creator'
  });

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setLoading(true);

    try {
      const result = await creatorBrandPartnershipService?.proposeRevenueShare({
        proposalId: proposal?.id,
        creatorId: user?.id,
        brandId: proposal?.brandId,
        ...formData
      });

      if (result?.error) throw new Error(result?.error?.message);

      toast?.success('Revenue share proposal sent!');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error proposing revenue share:', error);
      toast?.error(error?.message || 'Failed to propose revenue share');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Negotiate Revenue Share</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Your Share (%)
              </label>
              <input
                type="number"
                value={formData?.creatorSharePercentage}
                onChange={(e) => setFormData({ ...formData, creatorSharePercentage: parseFloat(e?.target?.value) })}
                min={0}
                max={100}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Brand Share (%)
              </label>
              <input
                type="number"
                value={formData?.brandSharePercentage}
                onChange={(e) => setFormData({ ...formData, brandSharePercentage: parseFloat(e?.target?.value) })}
                min={0}
                max={100}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Platform Fee (%)
              </label>
              <input
                type="number"
                value={formData?.platformFeePercentage}
                onChange={(e) => setFormData({ ...formData, platformFeePercentage: parseFloat(e?.target?.value) })}
                min={0}
                max={100}
                required
                disabled
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Payment Terms
            </label>
            <textarea
              value={formData?.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e?.target?.value })}
              rows={4}
              placeholder="Describe payment schedule, milestones, etc."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <p className="text-sm text-blue-900 dark:text-blue-300">
              <strong>Your Earnings:</strong> ${((formData?.totalBudget * formData?.creatorSharePercentage) / 100)?.toFixed(2)}
            </p>
          </div>

          <div className="flex justify-end gap-3">
            <Button onClick={onClose} variant="secondary" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Proposal'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatorBrandPartnershipPortal;