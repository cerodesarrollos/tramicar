'use client'
import { useEffect, useState } from 'react'
import { getRisks, saveRisks, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Risk } from '../../data'
import { Shield, Plus, X, AlertTriangle, Pencil, Trash2 } from 'lucide-react'

const PROB_LABEL: Record<string, string> = { alta: 'Alta', media: 'Media', baja: 'Baja' }
const IMPACT_LABEL: Record<string, string> = { crítico: 'Crítico', alto: 'Alto', medio: 'Medio', bajo: 'Bajo' }

const CATEGORY_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  regulatorio: { emoji: '⚖️', label: 'Regulatorio', color: '#f59e0b' },
  tech: { emoji: '⚙️', label: 'Tech', color: '#818cf8' },
  mercado: { emoji: '📊', label: 'Mercado', color: '#34d399' },
  financiero: { emoji: '💰', label: 'Financiero', color: '#f472b6' },
  operativo: { emoji: '🔧', label: 'Operativo', color: '#fb923c' },
}

function riskScore(prob: string, impact: string): { score: number; color: string; label: string } {
  const pVal: Record<string, number> = { alta: 3, media: 2, baja: 1 }
  const iVal: Record<string, number> = { crítico: 4, alto: 3, medio: 2, bajo: 1 }
  const s = (pVal[prob] || 1) * (iVal[impact] || 1)
  if (s >= 9) return { score: s, color: '#ef4444', label: 'CRÍTICO' }
  if (s >= 6) return { score: s, color: '#f59e0b', label: 'ALTO' }
  if (s >= 3) return { score: s, color: '#818cf8', label: 'MEDIO' }
  return { score: s, color: '#6b7280', label: 'BAJO' }
}

export default function RiesgosPage() {
  const [risks, setRisks] = useState<Risk[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', probability: 'media' as Risk['probability'],
    impact: 'alto' as Risk['impact'], mitigation: '', category: 'mercado' as Risk['category'],
  })
  const [filter, setFilter] = useState<'all' | 'activo' | 'mitigado' | 'materializado'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getRisks().then(setRisks)
  }, [])

  if (!mounted) return null

  const addRisk = () => {
    if (!form.title.trim()) return
    const user = getUser()
    const r: Risk = {
      id: `rk${Date.now()}`, title: form.title.trim(), description: form.description.trim(),
      probability: form.probability, impact: form.impact, mitigation: form.mitigation.trim(),
      owner: user?.id || 'matias', status: 'activo', category: form.category,
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [r, ...risks]
    setRisks(updated)
    saveRisks(updated)
    addActivity(user?.id || 'unknown', 'identificó riesgo', form.title.trim())
    setForm({ title: '', description: '', probability: 'media', impact: 'alto', mitigation: '', category: 'mercado' })
    setShowForm(false)
  }

  const updateStatus = (id: string, status: Risk['status']) => {
    const updated = risks.map(r => r.id === id ? { ...r, status } : r)
    setRisks(updated)
    saveRisks(updated)
    const r = updated.find(x => x.id === id)
    if (r) addActivity(getUser()?.id || 'unknown', status === 'mitigado' ? 'mitigó riesgo' : 'actualizó riesgo', r.title)
  }

  const deleteRisk = (id: string) => {
    const r = risks.find(x => x.id === id)
    const updated = risks.filter(x => x.id !== id)
    setRisks(updated)
    saveRisks(updated)
    if (r) addActivity(getUser()?.id || 'unknown', 'eliminó riesgo', r.title)
  }

  const filtered = filter === 'all' ? risks : risks.filter(r => r.status === filter)
  const activeRisks = risks.filter(r => r.status === 'activo')
  const criticalCount = activeRisks.filter(r => riskScore(r.probability, r.impact).score >= 9).length
  const highCount = activeRisks.filter(r => { const s = riskScore(r.probability, r.impact).score; return s >= 6 && s < 9 }).length

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <Shield size={18} className="text-amber-400" />
            </div>
            Risk Register
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Riesgos identificados y estrategias de mitigación</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Identificar
        </button>
      </div>

      {/* Risk summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-5 text-center">
          <p className="font-display text-3xl font-bold text-white tracking-tight">{activeRisks.length}</p>
          <p className="text-[11px] text-gray-500 mt-1">Riesgos activos</p>
        </div>
        <div className="glass-card !border-red-500/10 rounded-2xl p-5 text-center">
          <p className="font-display text-3xl font-bold text-red-400 tracking-tight">{criticalCount}</p>
          <p className="text-[11px] text-gray-500 mt-1">Críticos</p>
        </div>
        <div className="glass-card !border-amber-500/10 rounded-2xl p-5 text-center">
          <p className="font-display text-3xl font-bold text-amber-400 tracking-tight">{highCount}</p>
          <p className="text-[11px] text-gray-500 mt-1">Altos</p>
        </div>
      </div>

      {/* Matrix hint */}
      <div className="glass-card rounded-2xl p-5">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-4">Matriz Probabilidad × Impacto</p>
        <div className="grid grid-cols-4 gap-2 max-w-md">
          {['bajo', 'medio', 'alto', 'crítico'].map(impact => (
            ['baja', 'media', 'alta'].map(prob => {
              const rs = riskScore(prob, impact)
              const count = activeRisks.filter(r => r.probability === prob && r.impact === impact).length
              return (
                <div key={`${prob}-${impact}`} className="h-9 rounded-xl flex items-center justify-center text-[10px] font-mono font-bold transition-all" style={{ background: `${rs.color}10`, color: count > 0 ? rs.color : `${rs.color}40` }}>
                  {count > 0 ? count : ''}
                </div>
              )
            })
          )).flat()}
        </div>
        <div className="flex gap-6 mt-3">
          <span className="text-[9px] text-gray-700 font-medium">← Impacto</span>
          <span className="text-[9px] text-gray-700 font-medium">↑ Probabilidad</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([['all', 'Todos'], ['activo', 'Activos'], ['mitigado', 'Mitigados'], ['materializado', 'Materializados']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-[12px] font-medium px-4 py-2 rounded-xl transition-all duration-200 ${filter === key ? 'bg-gradient-to-r from-indigo-500/15 to-violet-500/10 text-indigo-300 border border-indigo-500/20 shadow-[0_0_15px_-5px_rgba(99,102,241,0.2)]' : 'text-gray-500 hover:text-gray-300 bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08]'}`}>
            {label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="glass-card !border-indigo-500/15 rounded-2xl p-6 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="¿Qué podría salir mal?"
            className="premium-input w-full" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción del riesgo..."
            className="premium-input w-full h-16 resize-none" />
          <textarea value={form.mitigation} onChange={e => setForm({ ...form, mitigation: e.target.value })}
            placeholder="Estrategia de mitigación..."
            className="premium-input w-full h-16 resize-none" />
          <div className="flex gap-3 flex-wrap">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Risk['category'] })}
              className="premium-input !py-2">
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
            <select value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value as Risk['probability'] })}
              className="premium-input !py-2">
              <option value="alta">Prob: Alta</option><option value="media">Prob: Media</option><option value="baja">Prob: Baja</option>
            </select>
            <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value as Risk['impact'] })}
              className="premium-input !py-2">
              <option value="crítico">Impacto: Crítico</option><option value="alto">Impacto: Alto</option><option value="medio">Impacto: Medio</option><option value="bajo">Impacto: Bajo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addRisk} className="btn-primary">Identificar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Risk cards */}
      <div className="space-y-3">
        {filtered.map(r => {
          const rs = riskScore(r.probability, r.impact)
          const cat = CATEGORY_CONFIG[r.category]
          const owner = TEAM_USERS.find(u => u.id === r.owner)
          return (
            <div key={r.id} className="glass-card rounded-2xl p-5 group">
              <div className="flex items-start gap-4">
                {/* Score badge */}
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center shrink-0 ring-1 ring-white/[0.04]" style={{ background: `${rs.color}10` }}>
                  <span className="font-display text-xl font-bold" style={{ color: rs.color }}>{rs.score}</span>
                  <span className="text-[8px] font-bold tracking-wider" style={{ color: rs.color }}>{rs.label}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h3 className="text-[13px] font-semibold text-white">{r.title}</h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium" style={{ background: `${cat.color}12`, color: cat.color }}>{cat.emoji} {cat.label}</span>
                    {r.status !== 'activo' && (
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${r.status === 'mitigado' ? 'bg-emerald-500/10 text-emerald-300' : 'bg-red-500/10 text-red-300'}`}>
                        {r.status === 'mitigado' ? '✅ Mitigado' : '⚠️ Materializado'}
                      </span>
                    )}
                  </div>

                  {r.description && <p className="text-[12px] text-gray-500 mt-2 leading-relaxed">{r.description}</p>}

                  {/* Prob × Impact */}
                  <div className="flex items-center gap-5 mt-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-600">Prob:</span>
                      <span className="text-[10px] font-semibold text-gray-400">{PROB_LABEL[r.probability]}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-600">Impacto:</span>
                      <span className="text-[10px] font-semibold text-gray-400">{IMPACT_LABEL[r.impact]}</span>
                    </div>
                    <span className="flex items-center gap-2 text-[11px]" style={{ color: owner?.color }}>
                      <span className="w-5 h-5 rounded-lg text-[10px] flex items-center justify-center ring-1 ring-white/[0.04]" style={{ background: `${owner?.color}15` }}>{owner?.avatar}</span>
                      {owner?.name}
                    </span>
                  </div>

                  {/* Mitigation */}
                  {r.mitigation && (
                    <div className="mt-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4">
                      <p className="text-[10px] text-emerald-400/80 font-semibold mb-1.5 uppercase tracking-wider">🛡️ Mitigación</p>
                      <p className="text-[12px] text-gray-400 leading-relaxed">{r.mitigation}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <select value={r.status} onChange={e => updateStatus(r.id, e.target.value as Risk['status'])}
                    className="text-[10px] bg-white/[0.03] border border-white/[0.08] rounded-lg px-2.5 py-1.5 text-gray-400 focus:outline-none cursor-pointer hover:border-white/[0.12] transition-all">
                    <option value="activo">Activo</option><option value="mitigado">Mitigado</option><option value="materializado">Materializado</option>
                  </select>
                  <button onClick={() => deleteRisk(r.id)} className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-500/5">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
