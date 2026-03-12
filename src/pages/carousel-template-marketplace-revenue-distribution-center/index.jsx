import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import HeaderNavigation from '../../components/ui/HeaderNavigation';
import { carouselTemplateMarketplaceService } from '../../services/carouselTemplateMarketplaceService';
import { Store, ShoppingCart, DollarSign, TrendingUp, Download, Eye, Star, Filter, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

function CarouselTemplateMarketplaceRevenueDistributionCenter() {
  const [loading, setLoading] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [activeTab, setActiveTab] = useState('marketplace');
  const [filters, setFilters] = useState({ carouselType: '', category: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [myTemplates, setMyTemplates] = useState([]);
  const [revenueAnalytics, setRevenueAnalytics] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);

  useEffect(() => {
    loadMarketplaceData();
  }, [filters]);

  const loadMarketplaceData = async () => {
    setLoading(true);
    try {
      const [templatesResult, myTemplatesResult, revenueResult, purchasesResult] = await Promise.all([
        carouselTemplateMarketplaceService?.getAllTemplates(filters),
        carouselTemplateMarketplaceService?.getCreatorTemplates(null),
        carouselTemplateMarketplaceService?.getCreatorRevenueAnalytics(null),
        carouselTemplateMarketplaceService?.getPurchaseHistory(null)
      ]);

      if (templatesResult?.data) setTemplates(templatesResult?.data);
      if (myTemplatesResult?.data) setMyTemplates(myTemplatesResult?.data);
      if (revenueResult?.data) setRevenueAnalytics(revenueResult?.data);
      if (purchasesResult?.data) setPurchaseHistory(purchasesResult?.data);
    } catch (err) {
      toast?.error('Failed to load marketplace data');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (templateId) => {
    try {
      const result = await carouselTemplateMarketplaceService?.purchaseTemplate(templateId);
      if (result?.error) {
        toast?.error(result?.error?.message);
      } else {
        toast?.success('Purchase initiated! Complete payment to download template.');
        // In production, redirect to Stripe checkout with clientSecret
      }
    } catch (err) {
      toast?.error('Purchase failed');
    }
  };

  const filteredTemplates = templates?.filter(t => 
    t?.templateName?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
    t?.description?.toLowerCase()?.includes(searchQuery?.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <Helmet>
        <title>Carousel Template Marketplace & Revenue Distribution Center | Vottery</title>
      </Helmet>
      <Toaster position="top-right" />
      <HeaderNavigation />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <Store className="w-10 h-10 text-blue-600" />
                Carousel Template Marketplace & Revenue Distribution Center
              </h1>
              <p className="text-gray-600">
                Monetize carousel designs with 70/30 revenue split • Buy and sell premium templates
              </p>
            </div>
            <button
              onClick={loadMarketplaceData}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Revenue Overview */}
        {revenueAnalytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <DollarSign className="w-8 h-8 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">Total Revenue (70%)</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">${revenueAnalytics?.totalRevenue}</p>
              <p className="text-sm text-gray-600 mt-1">Your creator share</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <ShoppingCart className="w-8 h-8 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Total Sales</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{revenueAnalytics?.totalSales}</p>
              <p className="text-sm text-gray-600 mt-1">Templates sold</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Avg Revenue</h3>
              </div>
              <p className="text-3xl font-bold text-purple-600">${revenueAnalytics?.avgRevenue}</p>
              <p className="text-sm text-gray-600 mt-1">Per template</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <Store className="w-8 h-8 text-orange-600" />
                <h3 className="text-lg font-semibold text-gray-900">My Templates</h3>
              </div>
              <p className="text-3xl font-bold text-orange-600">{myTemplates?.length}</p>
              <p className="text-sm text-gray-600 mt-1">Listed for sale</p>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-2 mb-6 border border-gray-200">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('marketplace')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'marketplace' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Template Marketplace
            </button>
            <button
              onClick={() => setActiveTab('myTemplates')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'myTemplates' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              My Templates
            </button>
            <button
              onClick={() => setActiveTab('purchases')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'purchases' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Purchase History
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors ${
                activeTab === 'revenue' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Revenue Split Tracking
            </button>
          </div>
        </div>

        {/* Marketplace Tab */}
        {activeTab === 'marketplace' && (
          <div>
            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6 border border-gray-200">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search templates..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filters?.carouselType}
                  onChange={(e) => setFilters({ ...filters, carouselType: e?.target?.value })}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Types</option>
                  <option value="horizontal">Horizontal Snap</option>
                  <option value="vertical">Vertical Stack</option>
                  <option value="gradient">Gradient Flow</option>
                </select>
                <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </button>
              </div>
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates?.map((template) => (
                <div key={template?.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <p className="text-white text-xl font-bold">{template?.templateName}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template?.templateName}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {template?.carouselType}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{template?.description}</p>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{template?.rating || 0}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{template?.totalPurchases} sales</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">${template?.price}</p>
                        <p className="text-xs text-gray-500">70% to creator</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedTemplate(template)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                        <button
                          onClick={() => handlePurchase(template?.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Buy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Templates Tab */}
        {activeTab === 'myTemplates' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">My Templates</h2>
            {myTemplates?.length === 0 ? (
              <div className="text-center py-12">
                <Store className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">You haven't created any templates yet</p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Create Template
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {myTemplates?.map((template) => (
                  <div key={template?.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template?.templateName}</h3>
                      <p className="text-sm text-gray-600">{template?.totalPurchases} sales • ${template?.totalRevenue} revenue</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        template?.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {template?.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Purchase History Tab */}
        {activeTab === 'purchases' && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Purchase History</h2>
            {purchaseHistory?.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No purchases yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {purchaseHistory?.map((purchase) => (
                  <div key={purchase?.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-semibold text-gray-900">{purchase?.template?.templateName}</h3>
                      <p className="text-sm text-gray-600">
                        Purchased {new Date(purchase?.purchasedAt)?.toLocaleDateString()} • ${purchase?.purchasePrice}
                      </p>
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Download
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Revenue Split Tracking Tab */}
        {activeTab === 'revenue' && revenueAnalytics && (
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Revenue Split Tracking (70/30)</h2>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-green-900 mb-2">Creator Revenue (70%)</h3>
                  <p className="text-4xl font-bold text-green-600">${revenueAnalytics?.totalRevenue}</p>
                  <p className="text-sm text-green-700 mt-2">Your earnings from {revenueAnalytics?.totalSales} sales</p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">Platform Revenue (30%)</h3>
                  <p className="text-4xl font-bold text-blue-600">
                    ${(parseFloat(revenueAnalytics?.totalRevenue) * 0.3 / 0.7)?.toFixed(2)}
                  </p>
                  <p className="text-sm text-blue-700 mt-2">Platform fee for marketplace services</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
                <div className="space-y-3">
                  {revenueAnalytics?.purchases?.slice(0, 10)?.map((purchase, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {new Date(purchase?.purchasedAt)?.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-600">${purchase?.creatorRevenue}</p>
                        <p className="text-xs text-gray-500">70% of ${(parseFloat(purchase?.creatorRevenue) / 0.7)?.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarouselTemplateMarketplaceRevenueDistributionCenter;