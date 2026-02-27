// Team Dashboard — Types & Auth Data

export type Role = 'CEO/CTO' | 'Comercial' | 'Advisor'

export interface TeamUser {
  id: string
  name: string
  role: Role
  password: string
  avatar: string
  color: string
}

export const TEAM_USERS: TeamUser[] = [
  { id: 'matias', name: 'Matias', role: 'CEO/CTO', password: 'ceo123', avatar: '🧠', color: '#818cf8' },
  { id: 'jony', name: 'Jony', role: 'Comercial', password: 'com123', avatar: '🤝', color: '#34d399' },
  { id: 'diego', name: 'Diego', role: 'Advisor', password: 'adv123', avatar: '🎯', color: '#f59e0b' },
]

export interface RoadmapPhase {
  id: string
  name: string
  period: string
  status: 'done' | 'active' | 'upcoming'
  milestones: { text: string; done: boolean }[]
}

export const INITIAL_ROADMAP: RoadmapPhase[] = []

export interface Meeting {
  id: string
  date: string
  title: string
  attendees: string[]
  notes: string
  actionItems: { text: string; assignee: string; done: boolean }[]
}

export const INITIAL_MEETINGS: Meeting[] = []

export interface Idea {
  id: string
  title: string
  description: string
  status: 'nueva' | 'evaluando' | 'aprobada' | 'descartada'
  author: string
  createdAt: string
}

export const INITIAL_IDEAS: Idea[] = []

export interface Blocker {
  id: string
  title: string
  description: string
  priority: 'alta' | 'media' | 'baja'
  assignee: string
  status: 'abierta' | 'en-progreso' | 'resuelta'
  createdAt: string
}

export const INITIAL_BLOCKERS: Blocker[] = []

export interface Resource {
  id: string
  title: string
  url: string
  type: 'repo' | 'doc' | 'link' | 'tool'
  addedBy: string
  addedAt: string
}

export const INITIAL_RESOURCES: Resource[] = []

export interface Activity {
  id: string
  user: string
  action: string
  target: string
  timestamp: string
}

export const INITIAL_ACTIVITIES: Activity[] = []

export interface Decision {
  id: string
  date: string
  title: string
  context: string
  decision: string
  alternatives: string[]
  rationale: string
  decidedBy: string[]
  impact: 'alta' | 'media' | 'baja'
  category: 'tech' | 'negocio' | 'legal' | 'producto'
}

export const INITIAL_DECISIONS: Decision[] = []

export interface Risk {
  id: string
  title: string
  description: string
  probability: 'alta' | 'media' | 'baja'
  impact: 'crítico' | 'alto' | 'medio' | 'bajo'
  mitigation: string
  owner: string
  status: 'activo' | 'mitigado' | 'materializado'
  category: 'regulatorio' | 'tech' | 'mercado' | 'financiero' | 'operativo'
  createdAt: string
}

export const INITIAL_RISKS: Risk[] = []
