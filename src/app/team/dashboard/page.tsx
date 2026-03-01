'use client'
import { useEffect, useState } from 'react'
import { getUser, getRoadmap, getBlockers, getActivities, getMeetings } from '../store'
import { TEAM_USERS } from '../data'
import type { TeamUser, RoadmapPhase, Blocker, Activity, Meeting } from '../data'
import { TrendingUp, AlertTriangle, Clock, Zap, ArrowUpRight, Target } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
}
const stagger = {
  animate: { transition: { staggerChildren: 0.06 } },
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
    { label: 'Progreso MVP', value: `${progress}%`, icon: TrendingUp, sub: `${doneMilestones}/${totalMilestones} milestones` },
    { label: 'Trabas abiertas', value: openBlockers, icon: AlertTriangle, sub: highBlockers > 0 ? `${highBlockers} alta prioridad` : 'Ninguna crítica', alert: highBlockers > 0 },
    { label: 'Reuniones', value: meetings.length, icon: Clock, sub: `Última: ${meetings[0]?.date || '-'}` },
    { label: 'Equipo activo', value: TEAM_USERS.length, icon: Zap, sub: 'Todos los fundadores' },
  ]

  return (
    <motion.div className="space-y-6" initial="initial" animate="animate" variants={stagger}>
      {/* Header */}
      <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
        <h1 className="text-2xl font-semibold text-white/90 tracking-tight">
          {greeting()}, {user?.name}
        </h1>
        <p className="text-white/35 text-sm mt-1">
          Día {daysSinceStart} de Tramicar · Fase: <span className="text-indigo-400/80 font-medium">{activePhase?.name}</span>
        </p>
      </motion.div>

      {/* KPI Cards */}
      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-3" variants={stagger}>
        {kpis.map((kpi) => (
          <motion.div key={kpi.label} variants={fadeIn} transition={{ duration: 0.3 }}>
            <Card className="bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.05] transition-colors cursor-default">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <kpi.icon size={15} strokeWidth={1.5} className={kpi.alert ? 'text-red-400/70' : 'text-white/25'} />
                  <span className="text-[10px] text-white/30 uppercase tracking-wider font-medium">{kpi.label}</span>
                </div>
                <p className="text-2xl font-semibold text-white/90 tracking-tight">{kpi.value}</p>
                <p className="text-[11px] text-white/25 mt-1">{kpi.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress Bar */}
      <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[13px] font-medium text-white/60 flex items-center gap-2">
                <Target size={14} strokeWidth={1.5} className="text-indigo-400/60" />
                Progreso general
              </h3>
              <span className="text-xs text-white/30 font-medium">{progress}% completado</span>
            </div>
            <Progress value={progress} className="h-1.5 bg-white/[0.06]" />
            <div className="flex justify-between mt-3">
              {roadmap.map(phase => (
                <div key={phase.id} className="text-center">
                  <p className={`text-[11px] font-medium ${phase.status === 'active' ? 'text-indigo-400/80' : phase.status === 'done' ? 'text-emerald-400/60' : 'text-white/20'}`}>
                    {phase.name}
                  </p>
                  <p className="text-[10px] text-white/15">{phase.period}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Two columns */}
      <motion.div className="grid lg:grid-cols-2 gap-3" variants={stagger}>
        {/* Recent activity */}
        <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[13px] font-medium text-white/60">Actividad reciente</CardTitle>
                <Link href="/team/dashboard/actividad" className="text-[11px] text-indigo-400/60 hover:text-indigo-400/90 flex items-center gap-1 font-medium transition-colors">
                  Ver todo <ArrowUpRight size={11} />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-3">
                {activities.slice(0, 5).map((a, i) => {
                  const u = TEAM_USERS.find(u => u.id === a.user)
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }} className="flex items-start gap-2.5">
                      <Avatar className="h-6 w-6 mt-0.5 border border-white/[0.06]">
                        <AvatarFallback className="bg-white/[0.06] text-white/50 text-[10px]">{u?.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-xs text-white/40">
                          <span className="font-medium text-white/70">{u?.name}</span> {a.action} <span className="text-indigo-400/60">{a.target}</span>
                        </p>
                        <p className="text-[10px] text-white/20 mt-0.5">
                          {new Date(a.timestamp).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blockers */}
        <motion.div variants={fadeIn} transition={{ duration: 0.3 }}>
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardHeader className="pb-3 px-5 pt-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[13px] font-medium text-white/60">Trabas activas</CardTitle>
                <Link href="/team/dashboard/trabas" className="text-[11px] text-indigo-400/60 hover:text-indigo-400/90 flex items-center gap-1 font-medium transition-colors">
                  Ver todo <ArrowUpRight size={11} />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="px-5 pb-5">
              <div className="space-y-2">
                {blockers.filter(b => b.status !== 'resuelta').slice(0, 4).map((b, i) => {
                  const u = TEAM_USERS.find(u => u.id === b.assignee)
                  return (
                    <motion.div key={b.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                      className="flex items-center gap-2.5 bg-white/[0.02] rounded-md px-3 py-2.5 hover:bg-white/[0.04] transition-colors border border-white/[0.04]">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${b.priority === 'alta' ? 'bg-red-400/80' : b.priority === 'media' ? 'bg-amber-400/60' : 'bg-white/20'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-white/50 truncate">{b.title}</p>
                      </div>
                      <Badge variant="outline" className="text-[10px] text-white/25 border-white/[0.06] px-1.5 py-0 h-5">{u?.name}</Badge>
                    </motion.div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
