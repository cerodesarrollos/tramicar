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

  const kpis = [
    { label: 'Progreso MVP', value: `${progress}%`, icon: TrendingUp, gradient: 'from-indigo-500/20 to-violet-500/20', iconColor: 'text-indigo-400', borderColor: 'hover:border-indigo-500/20', sub: `${doneMilestones}/${totalMilestones} milestones` },
    { label: 'Trabas abiertas', value: openBlockers, icon: AlertTriangle, gradient: highBlockers > 0 ? 'from-red-500/20 to-orange-500/20' : 'from-amber-500/20 to-yellow-500/20', iconColor: highBlockers > 0 ? 'text-red-400' : 'text-amber-400', borderColor: highBlockers > 0 ? 'hover:border-red-500/20' : 'hover:border-amber-500/20', sub: highBlockers > 0 ? `${highBlockers} alta prioridad` : 'Ninguna crítica' },
    { label: 'Reuniones', value: meetings.length, icon: Clock, gradient: 'from-violet-500/20 to-purple-500/20', iconColor: 'text-violet-400', borderColor: 'hover:border-violet-500/20', sub: `Última: ${meetings[0]?.date || '-'}` },
    { label: 'Equipo activo', value: TEAM_USERS.length, icon: Zap, gradient: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400', borderColor: 'hover:border-emerald-500/20', sub: 'Todos los fundadores' },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-up">
        <h1 className="font-display text-3xl font-bold text-white tracking-tight">
          {greeting()}, {user?.name} <span className="inline-block">{user?.avatar}</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Día {daysSinceStart} de Tramicar · Fase: <span className="text-indigo-400 font-medium">{activePhase?.name}</span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up" style={{ animationDelay: '0.05s' }}>
        {kpis.map((kpi) => (
          <div key={kpi.label} className={`glass-card rounded-2xl p-5 ${kpi.borderColor} group`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${kpi.gradient} flex items-center justify-center`}>
                <kpi.icon size={17} className={kpi.iconColor} />
              </div>
              <span className="text-[10px] text-gray-600 uppercase tracking-widest font-medium">{kpi.label}</span>
            </div>
            <p className="font-display text-3xl font-bold text-white tracking-tight">{kpi.value}</p>
            <p className="text-[11px] text-gray-500 mt-1.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-2xl p-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
              <Target size={14} className="text-indigo-400" />
            </div>
            Progreso general
          </h3>
          <span className="text-xs text-gray-500 font-mono">{progress}%</span>
        </div>
        <div className="h-2.5 bg-white/[0.04] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out relative"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #a78bfa)' }}
          >
            <div className="absolute inset-0 rounded-full" style={{ boxShadow: '0 0 20px rgba(99,102,241,0.4)' }} />
          </div>
        </div>
        <div className="flex justify-between mt-4">
          {roadmap.map(phase => (
            <div key={phase.id} className="text-center">
              <p className={`text-[11px] font-medium ${phase.status === 'active' ? 'text-indigo-400' : phase.status === 'done' ? 'text-emerald-400' : 'text-gray-600'}`}>
                {phase.name}
              </p>
              <p className="text-[10px] text-gray-700 mt-0.5">{phase.period}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div className="grid lg:grid-cols-2 gap-5 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        {/* Recent activity */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Actividad reciente</h3>
            <Link href="/team/dashboard/actividad" className="text-[11px] text-indigo-400/80 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Ver todo <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3.5">
            {activities.slice(0, 5).map(a => {
              const u = TEAM_USERS.find(u => u.id === a.user)
              return (
                <div key={a.id} className="flex items-start gap-3 group">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ring-1 ring-white/[0.04] group-hover:ring-white/[0.08] transition-all" style={{ background: `${u?.color || '#666'}12` }}>
                    {u?.avatar || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] text-gray-400 leading-relaxed">
                      <span className="font-medium text-gray-200">{u?.name}</span>{' '}
                      {a.action}{' '}
                      <span className="text-indigo-400/80">{a.target}</span>
                    </p>
                    <p className="text-[10px] text-gray-700 mt-0.5">
                      {new Date(a.timestamp).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Blockers */}
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-white">Trabas activas</h3>
            <Link href="/team/dashboard/trabas" className="text-[11px] text-indigo-400/80 hover:text-indigo-300 flex items-center gap-1 transition-colors">
              Ver todo <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {blockers.filter(b => b.status !== 'resuelta').slice(0, 4).map(b => {
              const u = TEAM_USERS.find(u => u.id === b.assignee)
              return (
                <div key={b.id} className="flex items-center gap-3 rounded-xl px-4 py-3 bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all group">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${b.priority === 'alta' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]' : b.priority === 'media' ? 'bg-amber-500' : 'bg-gray-600'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-gray-300 truncate group-hover:text-gray-100 transition-colors">{b.title}</p>
                  </div>
                  <span className="text-[10px] text-gray-600 shrink-0">{u?.name}</span>
                </div>
              )
            })}
            {blockers.filter(b => b.status !== 'resuelta').length === 0 && (
              <div className="flex items-center gap-2 px-4 py-3 text-[13px] text-emerald-400/60">
                <CheckCircle2 size={14} /> Sin trabas activas
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
