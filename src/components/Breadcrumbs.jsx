import React from 'react';
import { useLocation } from 'react-router-dom';


import { navigationService } from '../services/navigationService';

export const Breadcrumbs = () => {
  const location = useLocation();
  
  // Early return if navigationService is not available
  if (!navigationService || typeof navigationService?.getAllScreens !== 'function') {
    return null;
  }

  // Get all screens safely
  let allScreens = [];
  try {
    allScreens = navigationService?.getAllScreens();
  } catch (error) {
    console.error('Error getting screens:', error);
    return null;
  }

  // Validate allScreens is an array
  if (!Array.isArray(allScreens)) {
    return null;
  }

  // Find current screen
  const currentScreen = allScreens?.find(screen => screen && screen?.path === location?.pathname);
  
  if (!currentScreen) {
    return null;
  }

  // Build breadcrumb items
  const breadcrumbItems = [
    { name: 'Home', path: '/', icon: 'Home' },
  ];

  // Add category breadcrumb if exists and not home
  if (currentScreen?.category && currentScreen?.path !== '/') {
    let categoryIcon = 'Folder';
    
    // Safely get category icon
    if (typeof navigationService?.getCategoryIcon === 'function') {
      try {
        const icon = navigationService?.getCategoryIcon(currentScreen?.category);
        if (icon) {
          categoryIcon = icon;
        }
      } catch (error) {
        console.error('Error getting category icon:', error);
      }
    }
    
    breadcrumbItems?.push({
      name: currentScreen?.category,
      path: '#',
      icon: categoryIcon,
    });
  }

  // Add current screen if not home
  if (currentScreen?.path !== '/') {
    breadcrumbItems?.push({
      name: currentScreen?.name,
      path: currentScreen?.path,
      icon: currentScreen?.icon || 'FileText',
    });
  }

  return null;
};
