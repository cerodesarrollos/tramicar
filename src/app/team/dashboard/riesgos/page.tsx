'use client'
import { useEffect, useState } from 'react'
import { getRisks, saveRisks, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Risk } from '../../data'
import { Shield, Plus, X, AlertTriangle } from 'lucide-react'

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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Shield size={22} className="text-amber-400" /> Risk Register
          </h1>
          <p className="text-gray-400 text-sm mt-1">Riesgos identificados y estrategias de mitigación</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={16} /> Identificar
        </button>
      </div>

      {/* Risk summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-white">{activeRisks.length}</p>
          <p className="text-[11px] text-gray-500">Riesgos activos</p>
        </div>
        <div className="bg-red-500/5 border border-red-500/10 rounded-2xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-red-400">{criticalCount}</p>
          <p className="text-[11px] text-gray-500">Críticos</p>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 text-center">
          <p className="font-display text-2xl font-bold text-amber-400">{highCount}</p>
          <p className="text-[11px] text-gray-500">Altos</p>
        </div>
      </div>

      {/* Matrix hint */}
      <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4">
        <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-3">Matriz Probabilidad × Impacto</p>
        <div className="grid grid-cols-4 gap-1.5 max-w-md">
          {['bajo', 'medio', 'alto', 'crítico'].map(impact => (
            ['baja', 'media', 'alta'].map(prob => {
              const rs = riskScore(prob, impact)
              const count = activeRisks.filter(r => r.probability === prob && r.impact === impact).length
              return (
                <div key={`${prob}-${impact}`} className="h-8 rounded-lg flex items-center justify-center text-[10px] font-mono" style={{ background: `${rs.color}15`, color: rs.color }}>
                  {count > 0 ? count : ''}
                </div>
              )
            })
          )).flat()}
        </div>
        <div className="flex gap-4 mt-2">
          <span className="text-[9px] text-gray-600">← Impacto</span>
          <span className="text-[9px] text-gray-600">↑ Probabilidad</span>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {([['all', 'Todos'], ['activo', 'Activos'], ['mitigado', 'Mitigados'], ['materializado', 'Materializados']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-xs px-3 py-1.5 rounded-lg transition-all ${filter === key ? 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/20' : 'text-gray-400 hover:text-gray-200 bg-white/[0.02] border border-white/[0.06]'}`}>
            {label}
          </button>
        ))}
      </div>

      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="¿Qué podría salir mal?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción del riesgo..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-16 resize-none" />
          <textarea value={form.mitigation} onChange={e => setForm({ ...form, mitigation: e.target.value })}
            placeholder="Estrategia de mitigación..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-16 resize-none" />
          <div className="flex gap-3 flex-wrap">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Risk['category'] })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
              {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.emoji} {v.label}</option>)}
            </select>
            <select value={form.probability} onChange={e => setForm({ ...form, probability: e.target.value as Risk['probability'] })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
              <option value="alta">Prob: Alta</option><option value="media">Prob: Media</option><option value="baja">Prob: Baja</option>
            </select>
            <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value as Risk['impact'] })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
              <option value="crítico">Impacto: Crítico</option><option value="alto">Impacto: Alto</option><option value="medio">Impacto: Medio</option><option value="bajo">Impacto: Bajo</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addRisk} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl">Identificar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2">Cancelar</button>
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
            <div key={r.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-all group">
              <div className="flex items-start gap-4">
                {/* Score badge */}
                <div className="w-12 h-12 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: `${rs.color}15` }}>
                  <span className="font-display text-lg font-bold" style={{ color: rs.color }}>{rs.score}</span>
                  <span className="text-[8px] font-medium" style={{ color: rs.color }}>{rs.label}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-white">{r.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${cat.color}15`, color: cat.color }}>{cat.emoji} {cat.label}</span>
                    {r.status !== 'activo' && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${r.status === 'mitigado' ? 'bg-emerald-500/15 text-emerald-300' : 'bg-red-500/15 text-red-300'}`}>
                        {r.status === 'mitigado' ? '✅ Mitigado' : '⚠️ Materializado'}
                      </span>
                    )}
                  </div>

                  {r.description && <p className="text-xs text-gray-400 mt-1.5">{r.description}</p>}

                  {/* Prob × Impact */}
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-500">Prob:</span>
                      <span className="text-[10px] font-medium text-gray-300">{PROB_LABEL[r.probability]}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] text-gray-500">Impacto:</span>
                      <span className="text-[10px] font-medium text-gray-300">{IMPACT_LABEL[r.impact]}</span>
                    </div>
                    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: owner?.color }}>
                      <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: `${owner?.color}20` }}>{owner?.avatar}</span>
                      {owner?.name}
                    </span>
                  </div>

                  {/* Mitigation */}
                  {r.mitigation && (
                    <div className="mt-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3">
                      <p className="text-[10px] text-emerald-400 font-medium mb-1">🛡️ Mitigación</p>
                      <p className="text-xs text-gray-300 leading-relaxed">{r.mitigation}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <select value={r.status} onChange={e => updateStatus(r.id, e.target.value as Risk['status'])}
                    className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-400 focus:outline-none cursor-pointer">
                    <option value="activo">Activo</option><option value="mitigado">Mitigado</option><option value="materializado">Materializado</option>
                  </select>
                  <button onClick={() => deleteRisk(r.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
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
