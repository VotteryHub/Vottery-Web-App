import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const COUNTRIES = [
  'United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Japan', 'China', 'India', 'Brazil', 'Nigeria',
  'Australia', 'Mexico', 'South Korea', 'Italy', 'Spain', 'Netherlands', 'Sweden', 'Switzerland', 'Singapore'
];

const CONTINENTS = [
  'North America', 'South America', 'Europe', 'Asia', 'Africa', 'Oceania', 'Antarctica'
];

export default function AllocationControlMatrix() {
  const [allocationMode, setAllocationMode] = useState('random');
  const [allocations, setAllocations] = useState({
    countries: {},
    continents: {},
    gender: { male: 50, female: 50 },
    userTypes: {
      mau: 0,
      dau: 0,
      premiumBuyers: 0,
      subscribers: 0,
      advertisers: 0,
      creators: 0,
      others: 0
    }
  });
  const [othersDefinition, setOthersDefinition] = useState('');
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    calculateTotalPercentage();
  }, [allocations]);

  const calculateTotalPercentage = () => {
    let total = 0;
    
    if (allocationMode === 'country') {
      total = Object.values(allocations?.countries)?.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    } else if (allocationMode === 'continent') {
      total = Object.values(allocations?.continents)?.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    } else if (allocationMode === 'gender') {
      total = allocations?.gender?.male + allocations?.gender?.female;
    } else if (allocationMode === 'userTypes') {
      total = Object.values(allocations?.userTypes)?.reduce((sum, val) => sum + (parseFloat(val) || 0), 0);
    }
    
    setTotalPercentage(total);
  };

  const handleCountryChange = (country, value) => {
    setAllocations(prev => ({
      ...prev,
      countries: { ...prev?.countries, [country]: parseFloat(value) || 0 }
    }));
  };

  const handleContinentChange = (continent, value) => {
    setAllocations(prev => ({
      ...prev,
      continents: { ...prev?.continents, [continent]: parseFloat(value) || 0 }
    }));
  };

  const handleGenderChange = (gender, value) => {
    const newValue = parseFloat(value) || 0;
    const otherGender = gender === 'male' ? 'female' : 'male';
    setAllocations(prev => ({
      ...prev,
      gender: {
        [gender]: newValue,
        [otherGender]: 100 - newValue
      }
    }));
  };

  const handleUserTypeChange = (type, value) => {
    setAllocations(prev => ({
      ...prev,
      userTypes: { ...prev?.userTypes, [type]: parseFloat(value) || 0 }
    }));
  };

  const autoBalance = () => {
    if (allocationMode === 'country') {
      const selectedCountries = Object.keys(allocations?.countries)?.filter(c => allocations?.countries?.[c] > 0);
      const equalShare = 100 / selectedCountries?.length;
      const balanced = {};
      selectedCountries?.forEach(country => {
        balanced[country] = equalShare;
      });
      setAllocations(prev => ({ ...prev, countries: balanced }));
    }
  };

  const saveAllocation = async () => {
    // Save allocation rules to backend
    console.log('Saving allocation:', allocations);
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Allocation Mode
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => setAllocationMode('random')}
            className={`p-4 rounded-lg border-2 transition-all ${
              allocationMode === 'random'
                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Icon name="Shuffle" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">Fully Random</p>
          </button>

          <button
            onClick={() => setAllocationMode('country')}
            className={`p-4 rounded-lg border-2 transition-all ${
              allocationMode === 'country' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Icon name="Globe" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">By Country</p>
          </button>

          <button
            onClick={() => setAllocationMode('continent')}
            className={`p-4 rounded-lg border-2 transition-all ${
              allocationMode === 'continent' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Icon name="Map" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">By Continent</p>
          </button>

          <button
            onClick={() => setAllocationMode('gender')}
            className={`p-4 rounded-lg border-2 transition-all ${
              allocationMode === 'gender' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Icon name="Users" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">By Gender</p>
          </button>

          <button
            onClick={() => setAllocationMode('userTypes')}
            className={`p-4 rounded-lg border-2 transition-all ${
              allocationMode === 'userTypes' ?'border-purple-600 bg-purple-50 dark:bg-purple-900/20' :'border-gray-200 dark:border-gray-700 hover:border-purple-300'
            }`}
          >
            <Icon name="Target" className="w-6 h-6 mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium text-gray-900 dark:text-white">By User Type</p>
          </button>
        </div>
      </div>

      {/* Allocation Controls */}
      {allocationMode === 'country' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Country Allocation
            </h2>
            <button
              onClick={autoBalance}
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
            >
              Auto Balance
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {COUNTRIES?.map(country => (
              <div key={country} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {country}
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {allocations?.countries?.[country] || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={allocations?.countries?.[country] || 0}
                  onChange={(e) => handleCountryChange(country, e?.target?.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {allocationMode === 'continent' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Continent Allocation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONTINENTS?.map(continent => (
              <div key={continent} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {continent}
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {allocations?.continents?.[continent] || 0}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={allocations?.continents?.[continent] || 0}
                  onChange={(e) => handleContinentChange(continent, e?.target?.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {allocationMode === 'gender' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Gender Allocation
          </h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Male
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {allocations?.gender?.male}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={allocations?.gender?.male}
                onChange={(e) => handleGenderChange('male', e?.target?.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Female
                </label>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {allocations?.gender?.female}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={allocations?.gender?.female}
                onChange={(e) => handleGenderChange('female', e?.target?.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {allocationMode === 'userTypes' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            User Type Allocation
          </h2>
          <div className="space-y-4">
            {[
              { key: 'mau', label: 'Monthly Active Users (MAU)' },
              { key: 'dau', label: 'Daily Active Users (DAU)' },
              { key: 'premiumBuyers', label: 'Premium Buyers' },
              { key: 'subscribers', label: 'Subscribers' },
              { key: 'advertisers', label: 'Advertisers' },
              { key: 'creators', label: 'Content/Election Creators' }
            ]?.map(({ key, label }) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </label>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {allocations?.userTypes?.[key]}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="0.1"
                  value={allocations?.userTypes?.[key]}
                  onChange={(e) => handleUserTypeChange(key, e?.target?.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            ))}

            <div className="space-y-2 pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Others (Custom Definition)
              </label>
              <textarea
                value={othersDefinition}
                onChange={(e) => setOthersDefinition(e?.target?.value)}
                placeholder="Define custom user segment (e.g., 'users who voted in last 30 days and have level > 5')..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Allocation: {allocations?.userTypes?.others}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={allocations?.userTypes?.others}
                onChange={(e) => handleUserTypeChange('others', e?.target?.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* Total Percentage Indicator */}
      {allocationMode !== 'random' && (
        <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-6 border-2 ${
          totalPercentage === 100 ? 'border-green-500' : totalPercentage > 100 ? 'border-red-500' : 'border-yellow-500'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Total Allocation
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {totalPercentage === 100 ? 'Perfect balance achieved' : 
                 totalPercentage > 100 ? 'Over-allocated - reduce percentages': 'Under-allocated - increase percentages'}
              </p>
            </div>
            <div className="text-right">
              <p className={`text-3xl font-bold ${
                totalPercentage === 100 ? 'text-green-600' : 
                totalPercentage > 100 ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {totalPercentage?.toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={saveAllocation}
          disabled={allocationMode !== 'random' && totalPercentage !== 100}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save Allocation Rules
        </button>
      </div>
    </div>
  );
}