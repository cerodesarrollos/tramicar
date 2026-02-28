'use client'
import { useEffect, useState } from 'react'
import { getDecisions, saveDecisions, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Decision } from '../../data'
import { BookOpen, Plus, ChevronDown, ChevronRight, X, ArrowRight, Pencil, Trash2 } from 'lucide-react'

const CATEGORY_STYLES: Record<string, { emoji: string; label: string; color: string }> = {
  tech: { emoji: '⚙️', label: 'Tech', color: '#818cf8' },
  negocio: { emoji: '💼', label: 'Negocio', color: '#34d399' },
  legal: { emoji: '⚖️', label: 'Legal', color: '#f59e0b' },
  producto: { emoji: '🎯', label: 'Producto', color: '#f472b6' },
}

const IMPACT_STYLES: Record<string, { bg: string; text: string }> = {
  alta: { bg: 'bg-red-500/10', text: 'text-red-300' },
  media: { bg: 'bg-amber-500/10', text: 'text-amber-300' },
  baja: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
}

export default function DecisionesPage() {
  const [decisions, setDecisions] = useState<Decision[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', context: '', decision: '', alternatives: '', rationale: '', impact: 'media' as Decision['impact'], category: 'negocio' as Decision['category'] })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); getDecisions().then(setDecisions) }, [])
  if (!mounted) return null

  const toggle = (id: string) => setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const addDecision = () => {
    if (!form.title.trim() || !form.decision.trim()) return
    const user = getUser()
    const d: Decision = {
      id: `d${Date.now()}`, date: new Date().toISOString().split('T')[0],
      title: form.title.trim(), context: form.context.trim(), decision: form.decision.trim(),
      alternatives: form.alternatives.split('\n').map(a => a.trim()).filter(Boolean),
      rationale: form.rationale.trim(), decidedBy: [user?.id || 'unknown'],
      impact: form.impact, category: form.category,
    }
    const updated = [d, ...decisions]
    setDecisions(updated)
    saveDecisions(updated)
    addActivity(user?.id || 'unknown', 'registró decisión', form.title.trim())
    setForm({ title: '', context: '', decision: '', alternatives: '', rationale: '', impact: 'media', category: 'negocio' })
    setShowForm(false)
    setExpanded([d.id])
  }

  const deleteDecision = (id: string) => {
    const d = decisions.find(x => x.id === id)
    setDecisions(decisions.filter(x => x.id !== id))
    saveDecisions(decisions.filter(x => x.id !== id))
    if (d) addActivity(getUser()?.id || 'unknown', 'eliminó decisión', d.title)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
              <BookOpen size={18} className="text-indigo-400" />
            </div>
            Decision Log
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Por qué tomamos cada decisión importante</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Registrar
        </button>
      </div>

      {/* Insight banner */}
      <div className="glass-card !border-indigo-500/10 rounded-2xl p-5 flex items-start gap-3.5 animate-shimmer">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center shrink-0">
          <span className="text-base">💡</span>
        </div>
        <div>
          <p className="text-xs text-indigo-300 font-semibold">¿Por qué un Decision Log?</p>
          <p className="text-[12px] text-gray-500 mt-1 leading-relaxed">Las mejores startups documentan el <span className="text-indigo-400/80">por qué</span> detrás de cada decisión. Cuando un inversor pregunta "¿por qué no usaron blockchain?", tenés la respuesta lista con contexto y alternativas evaluadas.</p>
        </div>
      </div>

      {showForm && (
        <div className="glass-card !border-indigo-500/15 rounded-2xl p-6 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Título de la decisión"
            className="premium-input w-full" />
          <textarea value={form.context} onChange={e => setForm({ ...form, context: e.target.value })}
            placeholder="Contexto: ¿Qué problema había?"
            className="premium-input w-full h-16 resize-none" />
          <textarea value={form.decision} onChange={e => setForm({ ...form, decision: e.target.value })}
            placeholder="Decisión: ¿Qué se decidió?"
            className="premium-input w-full h-16 resize-none" />
          <textarea value={form.alternatives} onChange={e => setForm({ ...form, alternatives: e.target.value })}
            placeholder="Alternativas evaluadas (una por línea)"
            className="premium-input w-full h-16 resize-none" />
          <textarea value={form.rationale} onChange={e => setForm({ ...form, rationale: e.target.value })}
            placeholder="Razonamiento: ¿Por qué esta opción?"
            className="premium-input w-full h-16 resize-none" />
          <div className="flex gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Decision['category'] })}
              className="premium-input !py-2">
              <option value="tech">⚙️ Tech</option><option value="negocio">💼 Negocio</option>
              <option value="legal">⚖️ Legal</option><option value="producto">🎯 Producto</option>
            </select>
            <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value as Decision['impact'] })}
              className="premium-input !py-2">
              <option value="alta">🔴 Impacto alto</option><option value="media">🟡 Impacto medio</option><option value="baja">⚪ Impacto bajo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addDecision} className="btn-primary">Registrar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Decisions timeline */}
      <div className="space-y-3">
        {decisions.map(d => {
          const isOpen = expanded.includes(d.id)
          const cat = CATEGORY_STYLES[d.category]
          const imp = IMPACT_STYLES[d.impact]
          return (
            <div key={d.id} className="glass-card rounded-2xl overflow-hidden group">
              <button onClick={() => toggle(d.id)} className="w-full text-left px-6 py-4 flex items-center gap-3">
                {isOpen ? <ChevronDown size={15} className="text-gray-500 shrink-0" /> : <ChevronRight size={15} className="text-gray-500 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-[13px] font-semibold text-white">{d.title}</h3>
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium" style={{ background: `${cat.color}12`, color: cat.color }}>{cat.emoji} {cat.label}</span>
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-medium ${imp.bg} ${imp.text}`}>Impacto {d.impact}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-[11px] text-gray-600">{d.date}</span>
                    <div className="flex -space-x-1.5">
                      {d.decidedBy.map(id => {
                        const u = TEAM_USERS.find(u => u.id === id)
                        return <span key={id} className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center ring-2 ring-[#0d0d18]" style={{ background: `${u?.color || '#666'}25` }}>{u?.avatar}</span>
                      })}
                    </div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteDecision(d.id) }} className="text-gray-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 rounded-lg hover:bg-red-500/5 shrink-0">
                  <X size={14} />
                </button>
              </button>

              {isOpen && (
                <div className="px-6 pb-6 space-y-4">
                  {d.context && (
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-2">Contexto</p>
                      <p className="text-[13px] text-gray-400 leading-relaxed bg-white/[0.02] rounded-xl p-4 border border-white/[0.04]">{d.context}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-2">Decisión</p>
                    <p className="text-[13px] text-white font-medium leading-relaxed bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4">{d.decision}</p>
                  </div>

                  {d.alternatives.length > 0 && (
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-2">Alternativas evaluadas</p>
                      <div className="space-y-1.5">
                        {d.alternatives.map((alt, i) => (
                          <div key={i} className="flex items-center gap-2.5 text-[13px] text-gray-500 py-1">
                            <X size={12} className="text-red-400/40 shrink-0" />
                            <span>{alt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.rationale && (
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-2">Razonamiento</p>
                      <p className="text-[13px] text-gray-400 leading-relaxed bg-white/[0.02] rounded-xl p-4 border-l-2 border-indigo-500/20">{d.rationale}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
