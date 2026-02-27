'use client'

import { TEAM_USERS, INITIAL_ROADMAP, INITIAL_MEETINGS, INITIAL_IDEAS, INITIAL_BLOCKERS, INITIAL_RESOURCES, INITIAL_ACTIVITIES, INITIAL_DECISIONS, INITIAL_RISKS } from './data'
import type { TeamUser, RoadmapPhase, Meeting, Idea, Blocker, Resource, Activity, Decision, Risk } from './data'

const STORAGE_KEY = 'tramicar_team'
const AUTH_KEY = 'tramicar_team_user'

function load<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function save<T>(key: string, data: T) {
  if (typeof window === 'undefined') return
  localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(data))
}

// Auth
export function login(name: string, password: string): TeamUser | null {
  const user = TEAM_USERS.find(u => u.name.toLowerCase() === name.toLowerCase() && u.password === password)
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return user
  }
  return null
}

export function getUser(): TeamUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function logout() {
  localStorage.removeItem(AUTH_KEY)
}

// Data accessors
export function getRoadmap(): RoadmapPhase[] { return load('roadmap', INITIAL_ROADMAP) }
export function saveRoadmap(d: RoadmapPhase[]) { save('roadmap', d) }

export function getMeetings(): Meeting[] { return load('meetings', INITIAL_MEETINGS) }
export function saveMeetings(d: Meeting[]) { save('meetings', d) }

export function getIdeas(): Idea[] { return load('ideas', INITIAL_IDEAS) }
export function saveIdeas(d: Idea[]) { save('ideas', d) }

export function getBlockers(): Blocker[] { return load('blockers', INITIAL_BLOCKERS) }
export function saveBlockers(d: Blocker[]) { save('blockers', d) }

export function getResources(): Resource[] { return load('resources', INITIAL_RESOURCES) }
export function saveResources(d: Resource[]) { save('resources', d) }

export function getActivities(): Activity[] { return load('activities', INITIAL_ACTIVITIES) }
export function saveActivities(d: Activity[]) { save('activities', d) }

export function getDecisions(): Decision[] { return load('decisions', INITIAL_DECISIONS) }
export function saveDecisions(d: Decision[]) { save('decisions', d) }

export function getRisks(): Risk[] { return load('risks', INITIAL_RISKS) }
export function saveRisks(d: Risk[]) { save('risks', d) }

export function addActivity(user: string, action: string, target: string) {
  const activities = getActivities()
  activities.unshift({ id: `a${Date.now()}`, user, action, target, timestamp: new Date().toISOString() })
  saveActivities(activities.slice(0, 50))
}
