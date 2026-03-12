import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Globe, MapPin, User, TrendingUp, Star, Sparkles } from 'lucide-react';
import { platformGamificationService } from '../../../services/platformGamificationService';
import Icon from '../../../components/AppIcon';


export default function AllocationRulesPanel({ campaign, onUpdate }) {
  const [rules, setRules] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRule, setNewRule] = useState({
    allocation_type: 'country',
    allocation_criteria: {},
    percentage: 0,
    custom_definition: ''
  });
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    if (campaign?.allocation_rules) {
      setRules(campaign?.allocation_rules);
      calculateTotalPercentage(campaign?.allocation_rules);
    }
  }, [campaign]);

  const calculateTotalPercentage = (rulesList) => {
    const total = rulesList?.reduce((sum, rule) => sum + parseFloat(rule?.percentage || 0), 0);
    setTotalPercentage(total);
  };

  const handleAddRule = async () => {
    if (!campaign) return;

    const ruleData = {
      ...newRule,
      campaign_id: campaign?.id
    };

    const result = await platformGamificationService?.createAllocationRule(ruleData);
    if (result?.success) {
      setShowAddModal(false);
      setNewRule({
        allocation_type: 'country',
        allocation_criteria: {},
        percentage: 0,
        custom_definition: ''
      });
      onUpdate();
    }
  };

  const handleDeleteRule = async (ruleId) => {
    if (window.confirm('Are you sure you want to delete this allocation rule?')) {
      await platformGamificationService?.deleteAllocationRule(ruleId);
      onUpdate();
    }
  };

  const allocationTypes = [
    { value: 'country', label: 'By Country', icon: MapPin },
    { value: 'continent', label: 'By Continent', icon: Globe },
    { value: 'gender', label: 'By Gender', icon: User },
    { value: 'mau', label: 'Monthly Active Users', icon: TrendingUp },
    { value: 'dau', label: 'Daily Active Users', icon: TrendingUp },
    { value: 'premium_buyers', label: 'Premium Buyers', icon: Star },
    { value: 'subscribers', label: 'Subscribers', icon: Star },
    { value: 'advertisers', label: 'Advertisers', icon: TrendingUp },
    { value: 'creators', label: 'Content Creators', icon: Sparkles },
    { value: 'others', label: 'Custom (AI-Powered)', icon: Sparkles }
  ];

  const getTypeIcon = (type) => {
    const typeObj = allocationTypes?.find(t => t?.value === type);
    return typeObj?.icon || Users;
  };

  const getTypeLabel = (type) => {
    const typeObj = allocationTypes?.find(t => t?.value === type);
    return typeObj?.label || type;
  };

  if (!campaign) {
    return (
      <div className="text-center py-12">
        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-600">Select a campaign to manage allocation rules</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Allocation Rules</h2>
          <p className="text-gray-600 mt-1">Configure winner distribution by demographics and user segments</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          disabled={totalPercentage >= 100}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg transition-all shadow-lg ${
            totalPercentage >= 100
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed' :'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
          }`}
        >
          <Plus className="w-5 h-5" />
          Add Rule
        </button>
      </div>
      {/* Total Percentage Indicator */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900">Total Allocation</h3>
          <span className={`text-3xl font-bold ${
            totalPercentage === 100 ? 'text-green-600' :
            totalPercentage > 100 ? 'text-red-600': 'text-purple-600'
          }`}>
            {totalPercentage?.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ${
              totalPercentage === 100 ? 'bg-green-500' :
              totalPercentage > 100 ? 'bg-red-500': 'bg-gradient-to-r from-purple-500 to-pink-500'
            }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {totalPercentage === 100 ? '✓ Allocation complete' :
           totalPercentage > 100 ? '⚠ Allocation exceeds 100%' :
           `${(100 - totalPercentage)?.toFixed(1)}% remaining`}
        </p>
      </div>
      {/* Rules List */}
      <div className="space-y-4">
        {rules?.map((rule) => {
          const Icon = getTypeIcon(rule?.allocation_type);
          return (
            <div key={rule?.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-purple-100 rounded-lg">
                    <Icon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-1">
                      {getTypeLabel(rule?.allocation_type)}
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Percentage:</span>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">
                          {rule?.percentage}%
                        </span>
                      </div>
                      {rule?.allocation_criteria && Object.keys(rule?.allocation_criteria)?.length > 0 && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Criteria:</span>
                          <span className="ml-2">{JSON.stringify(rule?.allocation_criteria)}</span>
                        </div>
                      )}
                      {rule?.custom_definition && (
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Definition:</span>
                          <span className="ml-2 italic">{rule?.custom_definition}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteRule(rule?.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {rules?.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No allocation rules yet</h3>
          <p className="text-gray-600 mb-6">Add rules to control winner distribution</p>
        </div>
      )}
      {/* Add Rule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Add Allocation Rule</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Allocation Type</label>
                <select
                  value={newRule?.allocation_type}
                  onChange={(e) => setNewRule({ ...newRule, allocation_type: e?.target?.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {allocationTypes?.map((type) => (
                    <option key={type?.value} value={type?.value}>{type?.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Percentage (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={newRule?.percentage}
                  onChange={(e) => setNewRule({ ...newRule, percentage: parseFloat(e?.target?.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="10"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Available: {(100 - totalPercentage)?.toFixed(1)}%
                </p>
              </div>

              {newRule?.allocation_type === 'country' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country Code</label>
                  <input
                    type="text"
                    value={newRule?.allocation_criteria?.country || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      allocation_criteria: { country: e?.target?.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="US, UK, DE, etc."
                  />
                </div>
              )}

              {newRule?.allocation_type === 'continent' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Continent</label>
                  <select
                    value={newRule?.allocation_criteria?.continent || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      allocation_criteria: { continent: e?.target?.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select continent</option>
                    <option value="North America">North America</option>
                    <option value="South America">South America</option>
                    <option value="Europe">Europe</option>
                    <option value="Asia">Asia</option>
                    <option value="Africa">Africa</option>
                    <option value="Oceania">Oceania</option>
                    <option value="Antarctica">Antarctica</option>
                  </select>
                </div>
              )}

              {newRule?.allocation_type === 'gender' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                  <select
                    value={newRule?.allocation_criteria?.gender || ''}
                    onChange={(e) => setNewRule({
                      ...newRule,
                      allocation_criteria: { gender: e?.target?.value }
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              )}

              {newRule?.allocation_type === 'others' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Definition (AI-Powered)
                  </label>
                  <textarea
                    value={newRule?.custom_definition}
                    onChange={(e) => setNewRule({ ...newRule, custom_definition: e?.target?.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    rows="3"
                    placeholder="E.g., 'Users who voted more than 10 times in the last 30 days'"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Describe your custom criteria in natural language. AI will parse and apply it.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRule}
                className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all"
              >
                Add Rule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}