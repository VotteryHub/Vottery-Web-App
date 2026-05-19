import React from 'react';
import Icon from '../../../components/AppIcon';

const ProfileHeader = ({ user, isOwnProfile, activeTab, setActiveTab, tabs }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      {/* Cover Photo Container */}
      <div className="max-w-[1250px] mx-auto relative">
        <div className="h-[200px] md:h-[350px] lg:h-[450px] w-full rounded-b-xl overflow-hidden relative group cursor-pointer bg-gray-200 dark:bg-gray-800">
          <img 
            src={user?.cover_image || "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?w=1200"} 
            className="w-full h-full object-cover" 
            alt="Cover" 
          />
          {isOwnProfile && (
            <button className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 bg-white hover:bg-gray-100 text-gray-900 rounded-lg shadow-lg font-bold text-[15px] transition-all z-10">
              <Icon name="Camera" size={20} />
              <span className="hidden md:inline">Edit cover photo</span>
            </button>
          )}
        </div>

        {/* Profile Info Overlay Row */}
        <div className="px-4 md:px-8 -mt-4 md:-mt-8 lg:-mt-10 relative z-30 flex flex-col md:flex-row items-center md:items-end gap-4 pb-4">
          {/* Profile Picture */}
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full border-4 border-white dark:border-gray-900 bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-lg relative">
              {user?.avatar ? (
                <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-vottery-blue text-white text-5xl font-black">
                  {(user?.full_name || user?.name || 'V').charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {isOwnProfile && (
              <button className="absolute bottom-2 right-2 w-9 h-9 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 transition-all shadow-md">
                <Icon name="Camera" size={20} />
              </button>
            )}
          </div>

          {/* Name and Stats */}
          <div className="flex-1 text-center md:text-left mb-2">
            <h1 className="text-2xl md:text-[32px] font-black text-gray-900 dark:text-white leading-tight">
              {user?.full_name || user?.name || 'Vottery User'}
            </h1>
            <p className="text-[15px] md:text-[17px] font-bold text-gray-500 dark:text-gray-400 mt-1">
              456 friends • 12 mutual
            </p>
            {/* Mutual Friends Avatars */}
            <div className="flex items-center justify-center md:justify-start -space-x-2 mt-2">
               {[1,2,3,4,5].map(i => (
                 <img key={i} src={`https://randomuser.me/api/portraits/thumb/women/${i}.jpg`} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900" alt="" />
               ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 mb-4">
            {isOwnProfile ? (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-vottery-blue hover:bg-blue-600 text-white rounded-lg font-bold text-[15px] shadow-sm">
                  <Icon name="Plus" size={20} /> Add to story
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold text-[15px] shadow-sm">
                  <Icon name="Edit" size={20} /> Edit profile
                </button>
              </>
            ) : (
              <>
                <button className="flex items-center gap-2 px-4 py-2 bg-vottery-blue hover:bg-blue-600 text-white rounded-lg font-bold text-[15px] shadow-sm">
                  <Icon name="UserPlus" size={20} /> Add Friend
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold text-[15px] shadow-sm">
                  <Icon name="MessageCircle" size={20} /> Message
                </button>
              </>
            )}
            <button className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-bold text-[15px] shadow-sm">
              <Icon name="ChevronDown" size={20} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="border-t border-gray-100 dark:border-gray-800 px-4 md:px-8">
          <div className="max-w-[1050px] mx-auto flex items-center justify-between">
            <div className="flex overflow-x-auto no-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-4 text-[15px] font-bold transition-all relative whitespace-nowrap ${
                    activeTab === tab.id 
                      ? 'text-vottery-blue' 
                      : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-vottery-blue rounded-t-full" />
                  )}
                </button>
              ))}
            </div>
            <button className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
               <Icon name="MoreHorizontal" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;