'use client'
import { useEffect, useState } from 'react'
import { getUser, getRoadmap, getBlockers, getActivities, getMeetings } from '../store'
import { TEAM_USERS } from '../data'
import type { TeamUser, RoadmapPhase, Blocker, Activity, Meeting } from '../data'
import { TrendingUp, AlertTriangle, CheckCircle2, Clock, Target, Zap, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function OverviewPage() {
  const [user, setUser] = useState<TeamUser | null>(null)
  const [roadmap, setRoadmap] = useState<RoadmapPhase[]>([])
  const [blockers, setBlockers] = useState<Blocker[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setUser(getUser())
    async function load() {
      const [r, b, a, m] = await Promise.all([getRoadmap(), getBlockers(), getActivities(), getMeetings()])
      setRoadmap(r); setBlockers(b); setActivities(a); setMeetings(m)
    }
    load()
  }, [])

  if (!mounted) return null

  const totalMilestones = roadmap.reduce((acc, p) => acc + p.milestones.length, 0)
  const doneMilestones = roadmap.reduce((acc, p) => acc + p.milestones.filter(m => m.done).length, 0)
  const progress = totalMilestones ? Math.round((doneMilestones / totalMilestones) * 100) : 0
  const openBlockers = blockers.filter(b => b.status !== 'resuelta').length
  const highBlockers = blockers.filter(b => b.priority === 'alta' && b.status !== 'resuelta').length

  const activePhase = roadmap.find(p => p.status === 'active')

  const daysSinceStart = Math.floor((Date.now() - new Date('2026-02-25').getTime()) / 86400000)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-white">
          {greeting()}, {user?.name} {user?.avatar}
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          Día {daysSinceStart} de Tramicar · Fase: <span className="text-indigo-300">{activePhase?.name}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Progreso MVP', value: `${progress}%`, icon: TrendingUp, color: 'indigo', sub: `${doneMilestones}/${totalMilestones} milestones` },
          { label: 'Trabas abiertas', value: openBlockers, icon: AlertTriangle, color: highBlockers > 0 ? 'red' : 'amber', sub: highBlockers > 0 ? `${highBlockers} alta prioridad` : 'Ninguna crítica' },
          { label: 'Reuniones', value: meetings.length, icon: Clock, color: 'violet', sub: `Última: ${meetings[0]?.date || '-'}` },
          { label: 'Equipo activo', value: TEAM_USERS.length, icon: Zap, color: 'emerald', sub: 'Todos los fundadores' },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-all">
            <div className="flex items-center justify-between mb-3">
              <kpi.icon size={18} className={`text-${kpi.color}-400`} />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">{kpi.label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-white">{kpi.value}</p>
            <p className="text-[11px] text-gray-500 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-white flex items-center gap-2">
            <Target size={16} className="text-indigo-400" />
            Progreso general
          </h3>
          <span className="text-xs text-gray-400">{progress}% completado</span>
        </div>
        <div className="h-3 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {roadmap.map(phase => (
            <div key={phase.id} className="text-center">
              <p className={`text-[11px] font-medium ${phase.status === 'active' ? 'text-indigo-300' : phase.status === 'done' ? 'text-emerald-400' : 'text-gray-500'}`}>
                {phase.name}
              </p>
              <p className="text-[10px] text-gray-600">{phase.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent activity */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Actividad reciente</h3>
            <Link href="/team/dashboard/actividad" className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Ver todo <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3">
            {activities.slice(0, 5).map(a => {
              const u = TEAM_USERS.find(u => u.id === a.user)
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5" style={{ background: `${u?.color || '#666'}20` }}>
                    {u?.avatar || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-300">
                      <span className="font-medium text-white">{u?.name}</span> {a.action} <span className="text-indigo-300">{a.target}</span>
                    </p>
                    <p className="text-[10px] text-gray-600 mt-0.5">
                      {new Date(a.timestamp).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Blockers */}
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white">Trabas activas</h3>
            <Link href="/team/dashboard/trabas" className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
              Ver todo <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {blockers.filter(b => b.status !== 'resuelta').slice(0, 4).map(b => {
              const u = TEAM_USERS.find(u => u.id === b.assignee)
              return (
                <div key={b.id} className="flex items-center gap-3 bg-white/[0.02] rounded-xl px-3 py-2.5">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${b.priority === 'alta' ? 'bg-red-500' : b.priority === 'media' ? 'bg-amber-500' : 'bg-gray-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-200 truncate">{b.title}</p>
                  </div>
                  <span className="text-[10px] text-gray-500">{u?.name}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
