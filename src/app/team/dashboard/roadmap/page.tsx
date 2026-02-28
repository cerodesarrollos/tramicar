'use client'
import { useEffect, useState } from 'react'
import { getRoadmap, saveRoadmap, addActivity, getUser } from '../../store'
import type { RoadmapPhase } from '../../data'
import { CheckCircle2, Circle, ChevronDown, ChevronRight, Milestone, Plus, X } from 'lucide-react'

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

  const statusConfig: Record<string, { gradient: string; border: string; text: string; dot: string; dotGlow: string }> = {
    done: { gradient: 'from-emerald-500/[0.08] to-emerald-500/[0.02]', border: 'border-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-500', dotGlow: 'shadow-[0_0_10px_rgba(16,185,129,0.4)]' },
    active: { gradient: 'from-indigo-500/[0.08] to-violet-500/[0.02]', border: 'border-indigo-500/15', text: 'text-indigo-400', dot: 'bg-indigo-500', dotGlow: 'shadow-[0_0_10px_rgba(99,102,241,0.4)]' },
    upcoming: { gradient: 'from-white/[0.02] to-transparent', border: 'border-white/[0.05]', text: 'text-gray-500', dot: 'bg-gray-600', dotGlow: '' },
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
            <Milestone size={18} className="text-indigo-400" />
          </div>
          Roadmap
        </h1>
        <p className="text-gray-500 text-sm mt-2 ml-12">De MVP a escala nacional</p>
      </div>

      {/* Timeline */}
      <div className="relative ml-1">
        {/* Vertical line */}
        <div className="absolute left-[15px] top-4 bottom-4 w-px bg-gradient-to-b from-indigo-500/20 via-white/[0.06] to-transparent" />

        <div className="space-y-4">
          {phases.map((phase) => {
            const config = statusConfig[phase.status]
            const isOpen = expanded.includes(phase.id)
            const doneCount = phase.milestones.filter(m => m.done).length
            const totalCount = phase.milestones.length
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

            return (
              <div key={phase.id} className={`relative bg-gradient-to-r ${config.gradient} ${config.border} border rounded-2xl overflow-hidden transition-all duration-300 hover:border-opacity-100`}>
                {/* Dot on timeline */}
                <div className={`absolute left-[11px] top-6 w-[10px] h-[10px] rounded-full ${config.dot} ${config.dotGlow} ring-[3px] ring-[#0a0a0f] z-10`} />

                {/* Header */}
                <button onClick={() => toggleExpand(phase.id)} className="w-full text-left px-5 py-4 pl-10 flex items-center gap-3">
                  {isOpen ? <ChevronDown size={15} className="text-gray-500" /> : <ChevronRight size={15} className="text-gray-500" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className={`font-display font-bold ${config.text}`}>{phase.name}</h3>
                      <span className={`text-[10px] font-medium uppercase tracking-wider ${config.text} opacity-60`}>
                        {phase.status === 'active' ? '● EN CURSO' : phase.status === 'done' ? '✓ COMPLETO' : 'PRÓXIMO'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 mt-0.5">{phase.period}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-mono font-bold ${config.text}`}>{pct}%</p>
                    <p className="text-[10px] text-gray-600">{doneCount}/{totalCount}</p>
                  </div>
                </button>

                {/* Progress bar */}
                <div className="mx-5 mb-1 h-1 bg-white/[0.04] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{
                      width: `${pct}%`,
                      background: phase.status === 'done'
                        ? 'linear-gradient(90deg, #10b981, #34d399)'
                        : 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }}
                  />
                </div>

                {/* Milestones */}
                {isOpen && (
                  <div className="px-5 pb-4 pt-3 pl-10 space-y-1.5">
                    {phase.milestones.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => toggleMilestone(phase.id, i)}
                        className="w-full flex items-center gap-3 text-left group py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/[0.02] transition-all"
                      >
                        {m.done ? (
                          <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                        ) : (
                          <Circle size={16} className="text-gray-600 group-hover:text-indigo-400 shrink-0 transition-colors" />
                        )}
                        <span className={`text-[13px] ${m.done ? 'text-gray-600 line-through' : 'text-gray-300 group-hover:text-gray-100'} transition-colors`}>{m.text}</span>
                      </button>
                    ))}

                    {/* Add milestone */}
                    {newMilestone?.phaseId === phase.id ? (
                      <div className="flex items-center gap-2 mt-3">
                        <input
                          autoFocus
                          value={newMilestone.text}
                          onChange={e => setNewMilestone({ ...newMilestone, text: e.target.value })}
                          onKeyDown={e => e.key === 'Enter' && addMilestoneToPhase()}
                          placeholder="Nuevo milestone..."
                          className="premium-input flex-1 !py-2 !text-[13px]"
                        />
                        <button onClick={addMilestoneToPhase} className="text-indigo-400 hover:text-indigo-300 p-1.5 rounded-lg hover:bg-indigo-500/10 transition-all"><CheckCircle2 size={17} /></button>
                        <button onClick={() => setNewMilestone(null)} className="text-gray-600 hover:text-gray-300 p-1.5 rounded-lg hover:bg-white/5 transition-all"><X size={17} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setNewMilestone({ phaseId: phase.id, text: '' })}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-indigo-400 transition-colors mt-2 py-1.5 px-2 -mx-2 rounded-lg hover:bg-white/[0.02]"
                      >
                        <Plus size={14} /> Agregar milestone
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
