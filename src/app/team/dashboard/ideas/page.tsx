'use client'
import { useEffect, useState } from 'react'
import { getIdeas, saveIdeas, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Idea } from '../../data'
import { Lightbulb, Plus, X, GripVertical, Pencil, Trash2 } from 'lucide-react'

const COLUMNS: { key: Idea['status']; label: string; color: string; gradient: string }[] = [
  { key: 'nueva', label: '💡 Nueva', color: 'indigo', gradient: 'from-indigo-500/10 to-indigo-500/0' },
  { key: 'evaluando', label: '🔍 Evaluando', color: 'amber', gradient: 'from-amber-500/10 to-amber-500/0' },
  { key: 'aprobada', label: '✅ Aprobada', color: 'emerald', gradient: 'from-emerald-500/10 to-emerald-500/0' },
  { key: 'descartada', label: '❌ Descartada', color: 'gray', gradient: 'from-gray-500/10 to-gray-500/0' },
]

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); getIdeas().then(setIdeas) }, [])
  if (!mounted) return null

  const startEdit = (idea: Idea) => {
    setForm({ title: idea.title, description: idea.description })
    setEditingId(idea.id)
    setShowForm(true)
  }

  const saveIdea = () => {
    if (!form.title.trim()) return
    const user = getUser()
    if (editingId) {
      const updated = ideas.map(i => i.id === editingId ? { ...i, title: form.title.trim(), description: form.description.trim() } : i)
      setIdeas(updated)
      saveIdeas(updated)
      addActivity(user?.id || 'unknown', 'editó idea', form.title.trim())
    } else {
      const idea: Idea = {
        id: `i${Date.now()}`, title: form.title.trim(), description: form.description.trim(),
        status: 'nueva', author: user?.id || 'unknown', createdAt: new Date().toISOString().split('T')[0],
      }
      const updated = [...ideas, idea]
      setIdeas(updated)
      saveIdeas(updated)
      addActivity(user?.id || 'unknown', 'creó idea', form.title.trim())
    }
    setForm({ title: '', description: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const moveIdea = (id: string, newStatus: Idea['status']) => {
    const updated = ideas.map(i => i.id === id ? { ...i, status: newStatus } : i)
    setIdeas(updated)
    saveIdeas(updated)
    const idea = updated.find(i => i.id === id)
    if (idea) addActivity(getUser()?.id || 'unknown', `movió a ${newStatus}`, idea.title)
  }

  const deleteIdea = (id: string) => {
    const idea = ideas.find(i => i.id === id)
    const updated = ideas.filter(i => i.id !== id)
    setIdeas(updated)
    saveIdeas(updated)
    if (idea) addActivity(getUser()?.id || 'unknown', 'eliminó idea', idea.title)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
              <Lightbulb size={18} className="text-amber-400" />
            </div>
            Ideas
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Board de ideas del equipo</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '' }) }} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Nueva idea
        </button>
      </div>

      {showForm && (
        <div className="glass-card !border-indigo-500/15 rounded-2xl p-6 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Título de la idea" onKeyDown={e => e.key === 'Enter' && !e.shiftKey && saveIdea()}
            className="premium-input w-full" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción..."
            className="premium-input w-full h-20 resize-none" />
          <div className="flex gap-2 pt-1">
            <button onClick={saveIdea} className="btn-primary">Agregar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Kanban - scrollable on mobile */}
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-5 px-5 lg:mx-0 lg:px-0">
        {COLUMNS.map(col => {
          const colIdeas = ideas.filter(i => i.status === col.key)
          return (
            <div key={col.key} className="min-w-[260px] flex-1">
              <div className="flex items-center gap-2.5 mb-4 px-1">
                <span className="text-[13px] font-semibold text-gray-300">{col.label}</span>
                <span className="text-[10px] bg-white/[0.04] text-gray-600 px-2.5 py-0.5 rounded-full font-mono">{colIdeas.length}</span>
              </div>
              <div className="space-y-2.5">
                {colIdeas.map(idea => {
                  const author = TEAM_USERS.find(u => u.id === idea.author)
                  return (
                    <div key={idea.id} className="glass-card rounded-xl p-4 group">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-[13px] font-semibold text-white leading-snug">{idea.title}</h4>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <button onClick={() => startEdit(idea)} className="text-gray-700 hover:text-indigo-400 p-1 rounded-md hover:bg-indigo-500/5 transition-all"><Pencil size={12} /></button>
                          <button onClick={() => deleteIdea(idea.id)} className="text-gray-700 hover:text-red-400 p-1 rounded-md hover:bg-red-500/5 transition-all"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      {idea.description && <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">{idea.description}</p>}
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-lg text-[10px] flex items-center justify-center ring-1 ring-white/[0.04]" style={{ background: `${author?.color || '#666'}15` }}>{author?.avatar}</span>
                          <span className="text-[10px] text-gray-600">{idea.createdAt}</span>
                        </div>
                        <select
                          value={idea.status}
                          onChange={e => moveIdea(idea.id, e.target.value as Idea['status'])}
                          className="text-[10px] bg-white/[0.03] border border-white/[0.08] rounded-lg px-2 py-1 text-gray-500 focus:outline-none cursor-pointer hover:border-white/[0.12] transition-all"
                        >
                          {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
