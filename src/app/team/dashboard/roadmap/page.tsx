'use client'
import { useEffect, useState } from 'react'
import { getRoadmap, saveRoadmap, addActivity, getUser } from '../../store'
import type { RoadmapPhase } from '../../data'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Milestone, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeIn = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.08 } } }

export default function RoadmapPage() {
  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [newMilestone, setNewMilestone] = useState<{ phaseId: string; text: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function load() {
      const r = await getRoadmap()
      setPhases(r)
      setExpanded(r.filter(p => p.status === 'active').map(p => p.id))
    }
    load()
  }, [])

  if (!mounted) return null

  const toggleExpand = (id: string) => {
    setExpanded(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const toggleMilestone = (phaseId: string, idx: number) => {
    const updated = phases.map(p => {
      if (p.id !== phaseId) return p
      const milestones = [...p.milestones]
      milestones[idx] = { ...milestones[idx], done: !milestones[idx].done }
      return { ...p, milestones }
    })
    setPhases(updated)
    saveRoadmap(updated)
    const m = updated.find(p => p.id === phaseId)?.milestones[idx]
    if (m) addActivity(getUser()?.id || 'unknown', m.done ? 'completó' : 'reabrió', m.text)
  }

  const addMilestoneToPhase = () => {
    if (!newMilestone || !newMilestone.text.trim()) return
    const updated = phases.map(p => {
      if (p.id !== newMilestone.phaseId) return p
      return { ...p, milestones: [...p.milestones, { text: newMilestone.text.trim(), done: false }] }
    })
    setPhases(updated)
    saveRoadmap(updated)
    addActivity(getUser()?.id || 'unknown', 'agregó milestone', newMilestone.text.trim())
    setNewMilestone(null)
  }

  const statusColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    done: { bg: 'bg-emerald-50/80', border: 'border-emerald-200/60', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    active: { bg: 'bg-indigo-50/80', border: 'border-indigo-200/60', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    upcoming: { bg: 'bg-white', border: 'border-gray-200/80', text: 'text-gray-500', dot: 'bg-gray-300' },
  }

  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={stagger}>
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Milestone size={20} className="text-indigo-600" />
          </div>
          Roadmap
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">De MVP a escala nacional</p>
      </motion.div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gray-200" />

        <motion.div className="space-y-4" variants={stagger}>
          {phases.map((phase) => {
            const colors = statusColors[phase.status]
            const isOpen = expanded.includes(phase.id)
            const doneCount = phase.milestones.filter(m => m.done).length
            const totalCount = phase.milestones.length
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

            return (
              <motion.div
                key={phase.id}
                variants={fadeIn}
                transition={{ duration: 0.4 }}
                className={`relative ${colors.bg} ${colors.border} border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
              >
                {/* Dot on timeline */}
                <div className={`absolute left-[15px] top-6 w-[10px] h-[10px] rounded-full ${colors.dot} ring-2 ring-white z-10`} />

                {/* Header */}
                <button onClick={() => toggleExpand(phase.id)} className="w-full text-left px-5 py-4 pl-10 flex items-center gap-3">
                  {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-display font-bold ${colors.text}`}>{phase.name}</h3>
                      <span className={`text-[10px] uppercase font-medium px-2 py-0.5 rounded-full ${phase.status === 'active' ? 'bg-indigo-100 text-indigo-600' : phase.status === 'done' ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                        {phase.status === 'active' ? 'EN CURSO' : phase.status === 'done' ? 'COMPLETO' : 'PRÓXIMO'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{phase.period}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-mono font-bold ${colors.text}`}>{pct}%</p>
                    <p className="text-[10px] text-gray-400">{doneCount}/{totalCount}</p>
                  </div>
                </button>

                {/* Progress bar */}
                <div className="mx-5 mb-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: phase.status === 'done' ? 'linear-gradient(90deg, #16a34a, #22c55e)' : 'linear-gradient(90deg, #4338ca, #7c3aed)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </div>

                {/* Milestones */}
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-4 pt-3 pl-10 space-y-2">
                        {phase.milestones.map((m, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => toggleMilestone(phase.id, i)}
                            className="w-full flex items-center gap-3 text-left group py-1 rounded-lg hover:bg-white/60 px-2 -mx-2 transition-colors"
                          >
                            {m.done ? (
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            ) : (
                              <Circle size={16} className="text-gray-300 group-hover:text-indigo-500 shrink-0 transition-colors" />
                            )}
                            <span className={`text-sm ${m.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{m.text}</span>
                          </motion.button>
                        ))}

                        {/* Add milestone */}
                        {newMilestone?.phaseId === phase.id ? (
                          <div className="flex items-center gap-2 mt-2">
                            <input
                              autoFocus
                              value={newMilestone.text}
                              onChange={e => setNewMilestone({ ...newMilestone, text: e.target.value })}
                              onKeyDown={e => e.key === 'Enter' && addMilestoneToPhase()}
                              placeholder="Nuevo milestone..."
                              className="dash-input"
                            />
                            <button onClick={addMilestoneToPhase} className="text-indigo-600 hover:text-indigo-700 transition-colors"><CheckCircle2 size={18} /></button>
                            <button onClick={() => setNewMilestone(null)} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setNewMilestone({ phaseId: phase.id, text: '' })}
                            className="flex items-center gap-2 text-xs text-gray-400 hover:text-indigo-600 transition-colors mt-1 px-2"
                          >
                            <Plus size={14} /> Agregar milestone
                          </button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.div>
  )
}
