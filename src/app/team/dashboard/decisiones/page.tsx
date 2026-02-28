'use client'
import { useEffect, useState } from 'react'
import { getDecisions, saveDecisions, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Decision } from '../../data'
import { BookOpen, Plus, ChevronDown, ChevronRight, X, ArrowRight, Pencil, Trash2 } from 'lucide-react'

const CATEGORY_STYLES: Record<string, { emoji: string; label: string; color: string; bg: string }> = {
  tech: { emoji: '⚙️', label: 'Tech', color: '#4338ca', bg: '#eef2ff' },
  negocio: { emoji: '💼', label: 'Negocio', color: '#16a34a', bg: '#f0fdf4' },
  legal: { emoji: '⚖️', label: 'Legal', color: '#d97706', bg: '#fffbeb' },
  producto: { emoji: '🎯', label: 'Producto', color: '#db2777', bg: '#fdf2f8' },
}

const IMPACT_STYLES: Record<string, { bg: string; text: string }> = {
  alta: { bg: 'bg-red-50', text: 'text-red-600' },
  media: { bg: 'bg-amber-50', text: 'text-amber-600' },
  baja: { bg: 'bg-gray-100', text: 'text-gray-500' },
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
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BookOpen size={24} className="text-indigo-600" /> Decision Log
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">Por qué tomamos cada decisión importante</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="dash-btn-primary">
          <Plus size={16} /> Registrar
        </button>
      </div>

      {/* Insight banner */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-5 flex items-start gap-3">
        <span className="text-lg">💡</span>
        <div>
          <p className="text-xs text-indigo-700 font-semibold">¿Por qué un Decision Log?</p>
          <p className="text-[12px] text-gray-600 mt-1 leading-relaxed">Las mejores startups documentan el <span className="text-indigo-600 font-medium">por qué</span> detrás de cada decisión. Cuando un inversor pregunta "¿por qué no usaron blockchain?", tenés la respuesta lista con contexto y alternativas evaluadas.</p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-3 shadow-sm">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Título de la decisión"
            className="dash-input" />
          <textarea value={form.context} onChange={e => setForm({ ...form, context: e.target.value })}
            placeholder="Contexto: ¿Qué problema había?"
            className="dash-textarea h-16" />
          <textarea value={form.decision} onChange={e => setForm({ ...form, decision: e.target.value })}
            placeholder="Decisión: ¿Qué se decidió?"
            className="dash-textarea h-16" />
          <textarea value={form.alternatives} onChange={e => setForm({ ...form, alternatives: e.target.value })}
            placeholder="Alternativas evaluadas (una por línea)"
            className="dash-textarea h-16" />
          <textarea value={form.rationale} onChange={e => setForm({ ...form, rationale: e.target.value })}
            placeholder="Razonamiento: ¿Por qué esta opción?"
            className="dash-textarea h-16" />
          <div className="flex gap-3">
            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Decision['category'] })}
              className="dash-select">
              <option value="tech">⚙️ Tech</option><option value="negocio">💼 Negocio</option>
              <option value="legal">⚖️ Legal</option><option value="producto">🎯 Producto</option>
            </select>
            <select value={form.impact} onChange={e => setForm({ ...form, impact: e.target.value as Decision['impact'] })}
              className="dash-select">
              <option value="alta">🔴 Impacto alto</option><option value="media">🟡 Impacto medio</option><option value="baja">⚪ Impacto bajo</option>
            </select>
          </div>
          <div className="flex gap-2 pt-1">
            <button onClick={addDecision} className="dash-btn-primary">Registrar</button>
            <button onClick={() => setShowForm(false)} className="dash-btn-secondary">Cancelar</button>
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
            <div key={d.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-[1px] transition-all group">
              <button onClick={() => toggle(d.id)} className="w-full text-left px-5 py-4 flex items-center gap-3">
                {isOpen ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900">{d.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: cat.bg, color: cat.color }}>{cat.emoji} {cat.label}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${imp.bg} ${imp.text}`}>Impacto {d.impact}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-gray-400">{d.date}</span>
                    <div className="flex -space-x-1.5">
                      {d.decidedBy.map(id => {
                        const u = TEAM_USERS.find(u => u.id === id)
                        return <span key={id} className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center ring-2 ring-white" style={{ background: `${u?.color || '#666'}20` }}>{u?.avatar}</span>
                      })}
                    </div>
                  </div>
                </div>
                <button onClick={(e) => { e.stopPropagation(); deleteDecision(d.id) }} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1 shrink-0">
                  <X size={14} />
                </button>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 space-y-4">
                  {d.context && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">Contexto</p>
                      <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3">{d.context}</p>
                    </div>
                  )}

                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">Decisión</p>
                    <p className="text-xs text-gray-900 font-medium leading-relaxed bg-indigo-50 border border-indigo-100 rounded-xl p-3">{d.decision}</p>
                  </div>

                  {d.alternatives.length > 0 && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">Alternativas evaluadas</p>
                      <div className="space-y-1.5">
                        {d.alternatives.map((alt, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs text-gray-500">
                            <X size={12} className="text-red-400 shrink-0" />
                            <span>{alt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {d.rationale && (
                    <div>
                      <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5 font-semibold">Razonamiento</p>
                      <p className="text-xs text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3 border-l-2 border-indigo-400">{d.rationale}</p>
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
