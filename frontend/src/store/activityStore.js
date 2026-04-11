import { create } from 'zustand';
import { MOCK_PROFILES } from '../features/social/data/mockProfiles';

// Deterministic pseudo-random using sin as a hash
function dRand(seed) {
  const x = Math.sin(seed) * 43758.5453123;
  return x - Math.floor(x);
}

function generateMockActivity(profileSeed, density = 0.4) {
  const activity = {};
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const rand = dRand(profileSeed * 1000 + i);
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    // Force recent 6 days active so streak shows nicely
    if (rand < density || i < 6) {
      const pages = 10 + Math.floor(dRand(profileSeed * 500 + i * 7) * 65);
      activity[dateStr] = pages;
    }
  }
  return activity;
}

// ─── Pure utility functions (no Zustand, no React) ──────────────────────────

export function calcCurrentStreak(userActivityMap) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString().split('T')[0];

  const check = new Date(today);
  if (!(userActivityMap[todayStr] > 0)) check.setDate(check.getDate() - 1);

  let streak = 0;
  while (true) {
    const dateStr = check.toISOString().split('T')[0];
    if ((userActivityMap[dateStr] || 0) > 0) {
      streak++;
      check.setDate(check.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function calcLongestStreak(userActivityMap) {
  const dates = Object.keys(userActivityMap).sort();
  let longest = 0;
  let current = 0;
  let prev = null;
  for (const d of dates) {
    if (!prev) {
      current = 1;
    } else {
      const diff = Math.round((new Date(d) - new Date(prev)) / 86400000);
      current = diff === 1 ? current + 1 : 1;
    }
    if (current > longest) longest = current;
    prev = d;
  }
  return longest;
}

export function calcDaysLogged(userActivityMap) {
  return Object.keys(userActivityMap).length;
}

export function calcTotalPages(userActivityMap) {
  return Object.values(userActivityMap).reduce((s, p) => s + p, 0);
}

// ─── Store initialization ────────────────────────────────────────────────────

const MOCK_SEEDS = [42, 77, 13];
const MOCK_DENSITIES = [0.55, 0.42, 0.32];

function buildInitialActivityMap() {
  const map = {};
  MOCK_PROFILES.forEach((p, idx) => {
    map[p.id] = generateMockActivity(MOCK_SEEDS[idx], MOCK_DENSITIES[idx]);
  });
  return map;
}

function buildInitialSessions(activityMap) {
  const sessions = [];
  MOCK_PROFILES.forEach((profile) => {
    const map = activityMap[profile.id] || {};
    const recentDates = Object.keys(map).sort().reverse().slice(0, 5);
    recentDates.forEach((date, i) => {
      const book = profile.readingList[i % profile.readingList.length];
      sessions.push({
        id: `${profile.id}-${date}`,
        userId: profile.id,
        displayName: profile.displayName,
        username: profile.username,
        bookTitle: book.title,
        pagesRead: map[date],
        timestamp: new Date(date + 'T14:00:00').getTime(),
      });
    });
  });
  return sessions.sort((a, b) => b.timestamp - a.timestamp);
}

const _initialActivityMap = buildInitialActivityMap();
const _initialSessions = buildInitialSessions(_initialActivityMap);

// ─── Store ───────────────────────────────────────────────────────────────────

const useActivityStore = create((set) => ({
  // { [userId]: { [dateStr]: pagesRead } }
  activityMap: _initialActivityMap,
  // flat list sorted by timestamp desc
  sessions: _initialSessions,
  // { [userId]: bookTitle } — currently running timer sessions
  activeSessions: {},

  logSession: (userId, displayName, username, bookTitle, pagesRead) => {
    const today = new Date().toISOString().split('T')[0];
    set((state) => {
      const userMap = state.activityMap[userId] || {};
      const nextActive = { ...state.activeSessions };
      delete nextActive[userId];
      return {
        activityMap: {
          ...state.activityMap,
          [userId]: { ...userMap, [today]: (userMap[today] || 0) + pagesRead },
        },
        sessions: [
          {
            id: `${userId}-${Date.now()}`,
            userId, displayName, username, bookTitle, pagesRead,
            timestamp: Date.now(),
          },
          ...state.sessions,
        ],
        activeSessions: nextActive,
      };
    });
  },

  setActiveSession: (userId, bookTitle) =>
    set((state) => ({ activeSessions: { ...state.activeSessions, [userId]: bookTitle } })),

  clearActiveSession: (userId) =>
    set((state) => {
      const next = { ...state.activeSessions };
      delete next[userId];
      return { activeSessions: next };
    }),
}));

export default useActivityStore;
