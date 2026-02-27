'use client'

import { createClient } from '@/lib/supabase/client'
import { TEAM_USERS, INITIAL_ROADMAP, INITIAL_MEETINGS, INITIAL_IDEAS, INITIAL_BLOCKERS, INITIAL_RESOURCES, INITIAL_ACTIVITIES, INITIAL_DECISIONS, INITIAL_RISKS } from './data'
import type { TeamUser, RoadmapPhase, Meeting, Idea, Blocker, Resource, Activity, Decision, Risk } from './data'

const AUTH_KEY = 'tramicar_team_user'

// ─── Auth (stays localStorage) ───

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

// ─── Supabase helpers ───

function sb() { return createClient() }

// ─── Roadmap (2 tables → nested) ───

export async function getRoadmap(): Promise<RoadmapPhase[]> {
  try {
    const supabase = sb()
    const [{ data: phases }, { data: milestones }] = await Promise.all([
      supabase.from('roadmap_phases').select('*').order('sort_order'),
      supabase.from('roadmap_milestones').select('*').order('sort_order'),
    ])
    if (!phases) return INITIAL_ROADMAP
    return phases.map((p: any) => ({
      id: p.id,
      name: p.name,
      period: p.period,
      status: p.status,
      milestones: (milestones || [])
        .filter((m: any) => m.phase_id === p.id)
        .map((m: any) => ({ text: m.text, done: m.done })),
    }))
  } catch { return INITIAL_ROADMAP }
}

export async function saveRoadmap(d: RoadmapPhase[]) {
  try {
    const supabase = sb()
    // Upsert phases
    await supabase.from('roadmap_phases').upsert(
      d.map((p, i) => ({ id: p.id, name: p.name, period: p.period, status: p.status, sort_order: i }))
    )
    // Delete all milestones and re-insert
    await supabase.from('roadmap_milestones').delete().neq('id', 0)
    const allMilestones: any[] = []
    d.forEach(p => {
      p.milestones.forEach((m, i) => {
        allMilestones.push({ phase_id: p.id, text: m.text, done: m.done, sort_order: i })
      })
    })
    if (allMilestones.length) await supabase.from('roadmap_milestones').insert(allMilestones)
  } catch (e) { console.error('saveRoadmap error', e) }
}

// ─── Meetings (+ meeting_actions) ───

export async function getMeetings(): Promise<Meeting[]> {
  try {
    const supabase = sb()
    const [{ data: meetings }, { data: actions }] = await Promise.all([
      supabase.from('meetings').select('*').order('date', { ascending: false }),
      supabase.from('meeting_actions').select('*'),
    ])
    if (!meetings) return INITIAL_MEETINGS
    return meetings.map((m: any) => ({
      id: m.id,
      date: m.date,
      title: m.title,
      attendees: m.attendees || [],
      notes: m.notes || '',
      actionItems: (actions || [])
        .filter((a: any) => a.meeting_id === m.id)
        .map((a: any) => ({ text: a.text, assignee: a.assignee, done: a.done })),
    }))
  } catch { return INITIAL_MEETINGS }
}

export async function saveMeetings(d: Meeting[]) {
  try {
    const supabase = sb()
    await supabase.from('meetings').upsert(
      d.map(m => ({ id: m.id, date: m.date, title: m.title, attendees: m.attendees, notes: m.notes }))
    )
    // Re-insert actions
    await supabase.from('meeting_actions').delete().neq('id', 0)
    const allActions: any[] = []
    d.forEach(m => {
      (m.actionItems || []).forEach(a => {
        allActions.push({ meeting_id: m.id, text: a.text, assignee: a.assignee, done: a.done })
      })
    })
    if (allActions.length) await supabase.from('meeting_actions').insert(allActions)
  } catch (e) { console.error('saveMeetings error', e) }
}

// ─── Ideas ───

export async function getIdeas(): Promise<Idea[]> {
  try {
    const { data } = await sb().from('ideas').select('*').order('created_at', { ascending: false })
    if (!data) return INITIAL_IDEAS
    return data.map((r: any) => ({
      id: r.id, title: r.title, description: r.description,
      status: r.status, author: r.author, createdAt: r.created_at?.split('T')[0] || '',
    }))
  } catch { return INITIAL_IDEAS }
}

export async function saveIdeas(d: Idea[]) {
  try {
    await sb().from('ideas').upsert(
      d.map(i => ({ id: i.id, title: i.title, description: i.description, status: i.status, author: i.author, created_at: i.createdAt }))
    )
  } catch (e) { console.error('saveIdeas error', e) }
}

// ─── Blockers ───

export async function getBlockers(): Promise<Blocker[]> {
  try {
    const { data } = await sb().from('blockers').select('*').order('created_at', { ascending: false })
    if (!data) return INITIAL_BLOCKERS
    return data.map((r: any) => ({
      id: r.id, title: r.title, description: r.description,
      priority: r.priority, assignee: r.assignee, status: r.status,
      createdAt: r.created_at?.split('T')[0] || '',
    }))
  } catch { return INITIAL_BLOCKERS }
}

export async function saveBlockers(d: Blocker[]) {
  try {
    await sb().from('blockers').upsert(
      d.map(b => ({ id: b.id, title: b.title, description: b.description, priority: b.priority, assignee: b.assignee, status: b.status, created_at: b.createdAt }))
    )
  } catch (e) { console.error('saveBlockers error', e) }
}

// ─── Resources ───

export async function getResources(): Promise<Resource[]> {
  try {
    const { data } = await sb().from('resources').select('*').order('created_at', { ascending: false })
    if (!data) return INITIAL_RESOURCES
    return data.map((r: any) => ({
      id: r.id, title: r.title, url: r.url, type: r.type,
      addedBy: r.added_by, addedAt: r.created_at?.split('T')[0] || '',
    }))
  } catch { return INITIAL_RESOURCES }
}

export async function saveResources(d: Resource[]) {
  try {
    await sb().from('resources').upsert(
      d.map(r => ({ id: r.id, title: r.title, url: r.url, type: r.type, added_by: r.addedBy, created_at: r.addedAt }))
    )
  } catch (e) { console.error('saveResources error', e) }
}

// ─── Activities ───

export async function getActivities(): Promise<Activity[]> {
  try {
    const { data } = await sb().from('activities').select('*').order('created_at', { ascending: false }).limit(50)
    if (!data) return INITIAL_ACTIVITIES
    return data.map((r: any) => ({
      id: r.id, user: r.user_id, action: r.action, target: r.target,
      timestamp: r.created_at || '',
    }))
  } catch { return INITIAL_ACTIVITIES }
}

export async function saveActivities(d: Activity[]) {
  try {
    await sb().from('activities').upsert(
      d.map(a => ({ id: a.id, user_id: a.user, action: a.action, target: a.target, created_at: a.timestamp }))
    )
  } catch (e) { console.error('saveActivities error', e) }
}

export async function addActivity(user: string, action: string, target: string) {
  try {
    await sb().from('activities').insert({
      id: `a${Date.now()}`, user_id: user, action, target, created_at: new Date().toISOString(),
    })
  } catch (e) { console.error('addActivity error', e) }
}

// ─── Decisions ───

export async function getDecisions(): Promise<Decision[]> {
  try {
    const { data } = await sb().from('decisions').select('*').order('date', { ascending: false })
    if (!data) return INITIAL_DECISIONS
    return data.map((r: any) => ({
      id: r.id, date: r.date, title: r.title, context: r.context,
      decision: r.decision, alternatives: r.alternatives || [],
      rationale: r.rationale, decidedBy: r.decided_by || [],
      impact: r.impact, category: r.category,
    }))
  } catch { return INITIAL_DECISIONS }
}

export async function saveDecisions(d: Decision[]) {
  try {
    await sb().from('decisions').upsert(
      d.map(dec => ({
        id: dec.id, date: dec.date, title: dec.title, context: dec.context,
        decision: dec.decision, alternatives: dec.alternatives,
        rationale: dec.rationale, decided_by: dec.decidedBy,
        impact: dec.impact, category: dec.category,
      }))
    )
  } catch (e) { console.error('saveDecisions error', e) }
}

// ─── Risks ───

export async function getRisks(): Promise<Risk[]> {
  try {
    const { data } = await sb().from('risks').select('*').order('created_at', { ascending: false })
    if (!data) return INITIAL_RISKS
    return data.map((r: any) => ({
      id: r.id, title: r.title, description: r.description,
      probability: r.probability, impact: r.impact,
      mitigation: r.mitigation, owner: r.owner,
      status: r.status, category: r.category,
      createdAt: r.created_at?.split('T')[0] || '',
    }))
  } catch { return INITIAL_RISKS }
}

export async function saveRisks(d: Risk[]) {
  try {
    await sb().from('risks').upsert(
      d.map(r => ({
        id: r.id, title: r.title, description: r.description,
        probability: r.probability, impact: r.impact,
        mitigation: r.mitigation, owner: r.owner,
        status: r.status, category: r.category, created_at: r.createdAt,
      }))
    )
  } catch (e) { console.error('saveRisks error', e) }
}
