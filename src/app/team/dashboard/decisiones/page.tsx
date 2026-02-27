'use client'
import { useEffect, useState } from 'react'
import { getDecisions, saveDecisions, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Decision } from '../../data'
import { BookOpen, Plus, ChevronDown, ChevronRight, X, ArrowRight } from 'lucide-react'

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

  useEffect(() => { setMounted(true); setDecisions(getDecisions()) }, [])
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <BookOpen size={22} className="text-indigo-400" /> Decision Log
          </h1>
          <p className="text-gray-400 text-sm mt-1">Por qué tomamos cada decisión importante</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={16} /> Registrar
        </button>
      </div>

      {/* Insight banner */}
      <div className="bg-indigo-500/5 border border-indigo-500/15 rounded-2xl p-4 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div>
          <p className="text-xs text-indigo-200 font-medium">¿Por qué un Decision Log?</p>
          <p className="text-[11px] text-gray-400 mt-1">Las mejores startups documentan el <span className="text-indigo-300">por qué</span> detrás de cada decisión. Cuando un inversor pregunta "¿por qué no usaron blockchain?", tenés la respuesta lista con contexto y alternativas evaluadas.</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Título de la decisión"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50" />
          <textarea value={form.context} onChange={e => setForm({ ...form, context: e.target.value })}
            placeholder="Contexto: ¿Qué problema había?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-16 resize-none" />
          <textarea value={form.decision} onChange={e => setForm({ ...form, decision: e.target.value })}
            placeholder="Decisión: ¿Qué se decidió?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-16 resize-none" />
          <textarea value={form.alternatives} onChange={e => setForm({ ...form, alternatives: e.target.value })}
            placeholder="Alternativas evaluadas (una por línea)"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-16 resize-none" />
          <textarea value={form.rationale} onChange={e => setForm({ ...form, rationale: e.target.value })}
            placeholder="Razonamiento: ¿Por qué esta opción?"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-16 resize-none" />
          <div className="flex gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Decision['category'] })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
              <option value="tech">⚙️ Tech</option><option value="negocio">💼 Negocio</option>
              <option value="legal">⚖️ Legal</option><option value="producto">🎯 Producto</option>
            </select>
            <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value as Decision['impact'] })}
              className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
              <option value="alta">🔴 Impacto alto</option><option value="media">🟡 Impacto medio</option><option value="baja">⚪ Impacto bajo</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button onClick={addDecision} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl">Registrar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2">Cancelar</button>
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
            <div key={d.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
              <button onClick={() => toggle(d.id)} className="w-full text-left px-5 py-4 flex items-center gap-3">
                {isOpen ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-medium text-white">{d.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${cat.color}15`, color: cat.color }}>{cat.emoji} {cat.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${imp.bg} ${imp.text}`}>Impacto {d.impact}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-gray-500">{d.date}</span>
                    <div className="flex -space-x-1.5">
                      {d.decidedBy.map(id => {
                        const u = TEAM_USERS.find(u => u.id === id)
                        return <span key={id} className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center ring-1 ring-[#0a0a0f]" style={{ background: `${u?.color || '#666'}30` }}>{u?.avatar}</span>
                      })}
                    </div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteDecision(d.id) }} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1 shrink-0">
                  <X size={14} />
                </button>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4">
                  {d.context && (
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Contexto</p>
                      <p className="text-xs text-gray-300 leading-relaxed bg-white/[0.02] rounded-xl p-3">{d.context}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Decisión</p>
                    <p className="text-xs text-white font-medium leading-relaxed bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-3">{d.decision}</p>
                  </div>

                  {d.alternatives.length > 0 && (
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Alternativas evaluadas</p>
                      <div className="space-y-1.5">
                        {d.alternatives.map((alt, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-400">
                            <X size={12} className="text-red-400/50 shrink-0" />
                            <span>{alt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.rationale && (
                    <div>
                      <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-1.5">Razonamiento</p>
                      <p className="text-xs text-gray-300 leading-relaxed bg-white/[0.02] rounded-xl p-3 border-l-2 border-indigo-500/30">{d.rationale}</p>
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
