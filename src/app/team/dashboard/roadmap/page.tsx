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

  const statusColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
    done: { bg: 'bg-emerald-50', border: 'border-emerald-200/60', text: 'text-emerald-700', dot: 'bg-emerald-500' },
    active: { bg: 'bg-indigo-50', border: 'border-indigo-200/60', text: 'text-indigo-700', dot: 'bg-indigo-500' },
    upcoming: { bg: 'bg-white', border: 'border-gray-200/80', text: 'text-gray-500', dot: 'bg-gray-300' },
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
          <Milestone size={24} className="text-indigo-600" /> Roadmap
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">De MVP a escala nacional</p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-px bg-gray-200" />

        <div className="space-y-4">
          {phases.map((phase) => {
            const colors = statusColors[phase.status]
            const isOpen = expanded.includes(phase.id)
            const doneCount = phase.milestones.filter(m => m.done).length
            const totalCount = phase.milestones.length
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0

            return (
              <div key={phase.id} className={`relative ${colors.bg} ${colors.border} border rounded-2xl overflow-hidden shadow-sm`}>
                {/* Dot on timeline */}
                <div className={`absolute left-[15px] top-6 w-[10px] h-[10px] rounded-full ${colors.dot} ring-2 ring-white z-10`} />

                {/* Header */}
                <button onClick={() => toggleExpand(phase.id)} className="w-full text-left px-5 py-4 pl-10 flex items-center gap-3">
                  {isOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-display font-bold ${colors.text}`}>{phase.name}</h3>
                      <span className={`text-[10px] uppercase font-medium ${phase.status === 'active' ? 'text-indigo-500' : phase.status === 'done' ? 'text-emerald-500' : 'text-gray-400'}`}>
                        {phase.status === 'active' ? '● EN CURSO' : phase.status === 'done' ? '✓ COMPLETO' : 'PRÓXIMO'}
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
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: phase.status === 'done' ? '#16a34a' : '#4338ca' }} />
                </div>

                {/* Milestones */}
                {isOpen && (
                  <div className="px-5 pb-4 pt-3 pl-10 space-y-2">
                    {phase.milestones.map((m, i) => (
                      <button
                        key={i}
                        onClick={() => toggleMilestone(phase.id, i)}
                        className="w-full flex items-center gap-3 text-left group py-1"
                      >
                        {m.done ? (
                          <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={16} className="text-gray-300 group-hover:text-indigo-500 shrink-0 transition-colors" />
                        )}
                        <span className={`text-sm ${m.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{m.text}</span>
                      </button>
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
                        <button onClick={addMilestoneToPhase} className="text-indigo-600 hover:text-indigo-700"><CheckCircle2 size={18} /></button>
                        <button onClick={() => setNewMilestone(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setNewMilestone({ phaseId: phase.id, text: '' })}
                        className="flex items-center gap-2 text-xs text-gray-400 hover:text-indigo-600 transition-colors mt-1"
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
