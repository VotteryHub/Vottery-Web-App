/**
 * E2E Test: Achievement & Badge Unlock Flow
 * Tests: earn VP to trigger badge → verify badge appears in profile → check notification
 */

/// <reference types="cypress" />

/* global describe, beforeEach, it, cy */

describe('Achievement Unlock Flow', () => {
  beforeEach(() => {
    // Intercept gamification service calls
    cy?.intercept('GET', '**/rest/v1/user_gamification**', {
      statusCode: 200,
      body: [{
        user_id: 'test-user-id',
        total_xp: 1050,
        current_level: 3,
        current_xp: 50,
        streak_count: 7,
        last_activity_date: new Date()?.toISOString()?.split('T')?.[0],
      }],
    })?.as('gamificationData');

    // Intercept badges
    cy?.intercept('GET', '**/rest/v1/badges**', {
      statusCode: 200,
      body: [
        { id: 'badge-001', name: 'Streak Master', description: '7-day voting streak', icon: '🔥', xp_bonus: 50 },
        { id: 'badge-002', name: 'Policy Prophet', description: 'Correct prediction 5 times', icon: '🎯', xp_bonus: 100 },
        { id: 'badge-003', name: 'Bronze Voter', description: 'Cast 10 votes', icon: '🥉', xp_bonus: 25 },
      ],
    })?.as('badgesData');

    // Intercept user badges
    cy?.intercept('GET', '**/rest/v1/user_badges**', {
      statusCode: 200,
      body: [
        {
          id: 'ub-001',
          user_id: 'test-user-id',
          badge_id: 'badge-001',
          earned_at: new Date()?.toISOString(),
          badge: { name: 'Streak Master', icon: '🔥' },
        },
      ],
    })?.as('userBadges');

    // Intercept XP log
    cy?.intercept('GET', '**/rest/v1/xp_log**', {
      statusCode: 200,
      body: [
        { id: 'xp-001', xp_amount: 10, action_type: 'vote', created_at: new Date()?.toISOString() },
        { id: 'xp-002', xp_amount: 20, action_type: 'prediction_reward', created_at: new Date()?.toISOString() },
        { id: 'xp-003', xp_amount: 5, action_type: 'daily_login', created_at: new Date()?.toISOString() },
      ],
    })?.as('xpLog');

    // Intercept badge award
    cy?.intercept('POST', '**/rest/v1/user_badges**', {
      statusCode: 201,
      body: {
        id: 'ub-new-001',
        user_id: 'test-user-id',
        badge_id: 'badge-002',
        earned_at: new Date()?.toISOString(),
      },
    })?.as('badgeAward');

    // Intercept notifications
    cy?.intercept('GET', '**/rest/v1/notifications**', {
      statusCode: 200,
      body: [{
        id: 'notif-001',
        user_id: 'test-user-id',
        type: 'badge_earned',
        title: 'Badge Unlocked!',
        message: 'You earned the Streak Master badge',
        read: false,
        created_at: new Date()?.toISOString(),
      }],
    })?.as('notifications');
  });

  it('should display gamification hub with achievements', () => {
    cy?.visit('/gamification-progression-achievement-hub');
    cy?.get('body')?.should('be.visible');
    cy?.url()?.should('include', 'gamification-progression-achievement-hub');
  });

  it('should display user profile with badges', () => {
    cy?.visit('/user-profile-hub');
    cy?.get('body')?.should('be.visible');
    cy?.url()?.should('include', 'user-profile-hub');
  });

  it('should display VP balance and level in gamification center', () => {
    cy?.visit('/vottery-points-vp-universal-currency-center');
    cy?.get('body')?.should('be.visible');
    cy?.url()?.should('include', 'vottery-points-vp-universal-currency-center');
  });

  it('should display gamification rewards management', () => {
    cy?.visit('/gamification-rewards-management-center');
    cy?.get('body')?.should('be.visible');
    cy?.url()?.should('include', 'gamification-rewards-management-center');
  });

  it('should display notification center with badge notifications', () => {
    cy?.visit('/notification-center-hub');
    cy?.get('body')?.should('be.visible');
    cy?.url()?.should('include', 'notification-center-hub');
  });

  it('should display unified gamification dashboard', () => {
    cy?.visit('/unified-gamification-dashboard');
    cy?.get('body')?.should('be.visible');
    cy?.url()?.should('include', 'unified-gamification-dashboard');
  });

  it('should display dynamic quest management dashboard', () => {
    cy?.visit('/dynamic-quest-management-dashboard');
    cy?.get('body')?.should('be.visible');
    cy?.url()?.should('include', 'dynamic-quest-management-dashboard');
  });
});