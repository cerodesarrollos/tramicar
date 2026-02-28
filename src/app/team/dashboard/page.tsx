'use client'
import { useEffect, useState } from 'react'
import { getUser, getRoadmap, getBlockers, getActivities, getMeetings } from '../store'
import { TEAM_USERS } from '../data'
import type { TeamUser, RoadmapPhase, Blocker, Activity, Meeting } from '../data'
import { TrendingUp, AlertTriangle, Clock, Target, Zap, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

const fadeIn = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
}

const stagger = {
  animate: { transition: { staggerChildren: 0.08 } },
}

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
    { label: 'Progreso MVP', value: `${progress}%`, icon: TrendingUp, color: '#4338ca', bg: '#eef2ff', sub: `${doneMilestones}/${totalMilestones} milestones` },
    { label: 'Trabas abiertas', value: openBlockers, icon: AlertTriangle, color: highBlockers > 0 ? '#dc2626' : '#d97706', bg: highBlockers > 0 ? '#fef2f2' : '#fffbeb', sub: highBlockers > 0 ? `${highBlockers} alta prioridad` : 'Ninguna crítica' },
    { label: 'Reuniones', value: meetings.length, icon: Clock, color: '#7c3aed', bg: '#f5f3ff', sub: `Última: ${meetings[0]?.date || '-'}` },
    { label: 'Equipo activo', value: TEAM_USERS.length, icon: Zap, color: '#16a34a', bg: '#f0fdf4', sub: 'Todos los fundadores' },
  ]

  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900">
          {greeting()}, {user?.name} {user?.avatar}
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">
          Día {daysSinceStart} de Tramicar · Fase: <span className="text-indigo-600 font-medium">{activePhase?.name}</span>
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-4" variants={stagger}>
        {kpis.map((kpi) => (
          <motion.div
            key={kpi.label}
            variants={fadeIn}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
            className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 cursor-default"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.bg }}>
                <kpi.icon size={20} style={{ color: kpi.color }} />
              </div>
              <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{kpi.label}</span>
            </div>
            <p className="font-display text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-[11px] text-gray-400 mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            <Target size={16} className="text-indigo-600" />
            Progreso general
          </h3>
          <span className="text-xs text-gray-500 font-medium">{progress}% completado</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #4338ca, #7c3aed)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-4">
          {roadmap.map(phase => (
            <div key={phase.id} className="text-center">
              <p className={`text-[11px] font-medium ${phase.status === 'active' ? 'text-indigo-600' : phase.status === 'done' ? 'text-emerald-600' : 'text-gray-400'}`}>
                {phase.name}
              </p>
              <p className="text-[10px] text-gray-400">{phase.period}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Two columns */}
      <motion.div className="grid lg:grid-cols-2 gap-5" variants={stagger}>
        {/* Recent activity */}
        <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900">Actividad reciente</h3>
            <Link href="/team/dashboard/actividad" className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium transition-colors">
              Ver todo <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-3.5">
            {activities.slice(0, 5).map((a, i) => {
              const u = TEAM_USERS.find(u => u.id === a.user)
              return (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-0.5" style={{ background: `${u?.color || '#666'}15` }}>
                    {u?.avatar || '?'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-600">
                      <span className="font-medium text-gray-900">{u?.name}</span> {a.action} <span className="text-indigo-600">{a.target}</span>
                    </p>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {new Date(a.timestamp).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Blockers */}
        <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-gray-900">Trabas activas</h3>
            <Link href="/team/dashboard/trabas" className="text-[11px] text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-medium transition-colors">
              Ver todo <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="space-y-2.5">
            {blockers.filter(b => b.status !== 'resuelta').slice(0, 4).map((b, i) => {
              const u = TEAM_USERS.find(u => u.id === b.assignee)
              return (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.06 }}
                  className="flex items-center gap-3 bg-gray-50 rounded-xl px-3.5 py-2.5 hover:bg-gray-100/80 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full shrink-0 ${b.priority === 'alta' ? 'bg-red-500' : b.priority === 'media' ? 'bg-amber-500' : 'bg-gray-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-700 truncate">{b.title}</p>
                  </div>
                  <span className="text-[10px] text-gray-400">{u?.name}</span>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
