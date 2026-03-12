import React from 'react';
import { FileText, Users, Users2, Vote, TrendingUp } from 'lucide-react';
import Icon from '../../../components/AppIcon';


const SearchResultsPanel = ({ results, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'all', label: 'All Results', count: results?.totalResults || 0, icon: TrendingUp },
    { id: 'posts', label: 'Posts', count: results?.posts?.length || 0, icon: FileText },
    { id: 'users', label: 'Users', count: results?.users?.length || 0, icon: Users },
    { id: 'groups', label: 'Groups', count: results?.groups?.length || 0, icon: Users2 },
    { id: 'elections', label: 'Elections', count: results?.elections?.length || 0, icon: Vote }
  ];

  const renderContent = () => {
    if (activeTab === 'all') {
      return (
        <div className="space-y-4">
          {results?.rankedResults?.map((result, index) => (
            <ResultCard key={`${result?.type}-${result?.id}-${index}`} result={result} />
          )) || (
            <>
              {results?.posts?.map(post => <ResultCard key={`post-${post?.id}`} result={{ ...post, type: 'post' }} />)}
              {results?.elections?.map(election => <ResultCard key={`election-${election?.id}`} result={{ ...election, type: 'election' }} />)}
              {results?.groups?.map(group => <ResultCard key={`group-${group?.id}`} result={{ ...group, type: 'group' }} />)}
              {results?.users?.map(user => <ResultCard key={`user-${user?.id}`} result={{ ...user, type: 'user' }} />)}
            </>
          )}
        </div>
      );
    }

    const contentMap = {
      posts: results?.posts || [],
      users: results?.users || [],
      groups: results?.groups || [],
      elections: results?.elections || []
    };

    const content = contentMap?.[activeTab];

    return (
      <div className="space-y-4">
        {content?.map(item => (
          <ResultCard key={item?.id} result={{ ...item, type: activeTab?.slice(0, -1) }} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {tabs?.map(tab => {
            const Icon = tab?.icon;
            return (
              <button
                key={tab?.id}
                onClick={() => onTabChange(tab?.id)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-all whitespace-nowrap ${
                  activeTab === tab?.id
                    ? 'text-blue-600 border-b-2 border-blue-600' :'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab?.label}
                <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-gray-100">
                  {tab?.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* Results */}
      <div className="p-6">
        {results?.totalResults === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No results found. Try adjusting your search query or filters.</p>
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

const ResultCard = ({ result }) => {
  const getTypeColor = (type) => {
    const colors = {
      post: 'bg-blue-100 text-blue-700',
      user: 'bg-green-100 text-green-700',
      group: 'bg-purple-100 text-purple-700',
      election: 'bg-yellow-100 text-yellow-700'
    };
    return colors?.[type] || 'bg-gray-100 text-gray-700';
  };

  const getTitle = () => {
    return result?.title || result?.name || result?.username || 'Untitled';
  };

  const getDescription = () => {
    return result?.description || result?.bio || result?.content || '';
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(result?.type)}`}>
              {result?.type}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {getTitle()}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {getDescription()}
          </p>
        </div>
      </div>
      {/* Metadata */}
      <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
        {result?.user_profiles && (
          <span>By {result?.user_profiles?.username}</span>
        )}
        {result?.created_at && (
          <span>{new Date(result.created_at)?.toLocaleDateString()}</span>
        )}
        {result?.reactions && (
          <span>{result?.reactions?.[0]?.count || 0} reactions</span>
        )}
        {result?.votes && (
          <span>{result?.votes?.[0]?.count || 0} votes</span>
        )}
        {result?.members && (
          <span>{result?.members?.[0]?.count || 0} members</span>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPanel;