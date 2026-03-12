import React, { useState } from 'react';
import { Gift, DollarSign, Star, Zap, CreditCard, Shield } from 'lucide-react';

// Expanded VP Redemption categories per spec: Platform Perks, Election, Social, Real-world, VIP; Stripe/bank; blockchain log
const RedemptionShopManagement = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Ad-Free Hour', cost: 50, category: 'Platform Perks', stock: 'unlimited', redeemed: 1250, paymentMethod: null },
    { id: 2, name: 'Ad-Free Day', cost: 200, category: 'Platform Perks', stock: 'unlimited', redeemed: 420, paymentMethod: null },
    { id: 3, name: 'Custom Avatar', cost: 500, category: 'Platform Perks', stock: 'unlimited', redeemed: 890, paymentMethod: null },
    { id: 4, name: 'Priority Feed Boost (24h)', cost: 300, category: 'Platform Perks', stock: 'unlimited', redeemed: 340, paymentMethod: null },
    { id: 5, name: 'Bonus Vote (Election)', cost: 100, category: 'Election', stock: 'unlimited', redeemed: 2100, paymentMethod: null },
    { id: 6, name: 'Extra Lottery Ticket', cost: 250, category: 'Election', stock: 'unlimited', redeemed: 780, paymentMethod: null },
    { id: 7, name: 'Exclusive Group Access', cost: 400, category: 'Social', stock: 'unlimited', redeemed: 320, paymentMethod: null },
    { id: 8, name: 'Referral Bonus Pack', cost: 150, category: 'Social', stock: 'unlimited', redeemed: 950, paymentMethod: null },
    { id: 9, name: '$5 Amazon Gift Card', cost: 1000, category: 'Real-world', stock: 50, redeemed: 180, paymentMethod: 'Stripe' },
    { id: 10, name: 'Vottery T-Shirt', cost: 2000, category: 'Real-world', stock: 100, redeemed: 45, paymentMethod: 'Stripe' },
    { id: 11, name: '$1 Charity Donation', cost: 500, category: 'Real-world', stock: 'unlimited', redeemed: 520, paymentMethod: 'Stripe' },
    { id: 12, name: 'VIP Early Access (7 days)', cost: 800, category: 'VIP', stock: 'unlimited', redeemed: 120, paymentMethod: null },
    { id: 13, name: 'VIP Multi-Currency Payout', cost: 1500, category: 'VIP', stock: 'unlimited', redeemed: 85, paymentMethod: 'Stripe/PayPal' },
  ]);

  const categories = ['all', ...new Set(items.map(i => i.category))];
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredItems = filterCategory === 'all' 
    ? items 
    : items?.filter(i => i?.category === filterCategory);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Redemption Shop Management</h2>
        <p className="text-sm text-gray-600 mt-1">Manage VP redemption items and reward catalog</p>
      </div>
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Gift className="w-5 h-5 text-purple-600" />
            <span className="text-sm text-gray-600">Total Items</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{items?.length}</div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-5 h-5 text-yellow-600" />
            <span className="text-sm text-gray-600">Total Redemptions</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {items?.reduce((sum, i) => sum + i?.redeemed, 0)?.toLocaleString()}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">VP Spent</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {(items?.reduce((sum, i) => sum + (i?.cost * i?.redeemed), 0) / 1000)?.toFixed(0)}K
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Categories</span>
          </div>
          <div className="text-3xl font-bold text-gray-900">{categories?.length - 1}</div>
        </div>
      </div>
      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex flex-wrap gap-2">
          {categories?.map(category => (
            <button
              key={category}
              onClick={() => setFilterCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterCategory === category
                  ? 'bg-blue-600 text-white' :'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Items' : category}
            </button>
          ))}
        </div>
      </div>
      {/* Items List */}
      <div className="bg-white rounded-lg shadow-sm divide-y divide-gray-200">
        {filteredItems?.map(item => (
          <div key={item?.id} className="p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900">{item?.name}</h3>
                  <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                    {item?.category}
                  </span>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full font-medium">
                    {item?.cost} VP
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 flex-wrap">
                  <span>{item?.redeemed?.toLocaleString()} redeemed</span>
                  <span>•</span>
                  <span>Stock: {item?.stock === 'unlimited' ? 'Unlimited' : `${item?.stock} remaining`}</span>
                  {item?.paymentMethod && (
                    <>
                      <span>•</span>
                      <span>Payment: {item.paymentMethod}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm">
                  Edit
                </button>
                <button className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm">
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Payment & audit (Expanded VP Redemption spec) */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-blue-600" />
          Payment & audit
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Cash-equivalent redemptions (gift cards, merchandise, charity, VIP payouts) use <strong>Stripe</strong> or <strong>bank transfer</strong> per user payout settings.
        </p>
        <p className="text-sm text-gray-600 flex items-center gap-2">
          <Shield className="w-4 h-4 text-green-600" />
          All redemptions are logged on-chain for auditability; blockchain tx IDs are stored with each redemption record.
        </p>
      </div>

      {/* Add Item Button */}
      <div className="flex justify-end">
        <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
          Add New Item
        </button>
      </div>
    </div>
  );
};

export default RedemptionShopManagement;