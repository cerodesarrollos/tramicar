'use client'
import { useEffect, useState } from 'react'
import { getIdeas, saveIdeas, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Idea } from '../../data'
import { Lightbulb, Plus, X, GripVertical } from 'lucide-react'

const COLUMNS: { key: Idea['status']; label: string; color: string }[] = [
  { key: 'nueva', label: '💡 Nueva', color: 'indigo' },
  { key: 'evaluando', label: '🔍 Evaluando', color: 'amber' },
  { key: 'aprobada', label: '✅ Aprobada', color: 'emerald' },
  { key: 'descartada', label: '❌ Descartada', color: 'gray' },
]

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); setIdeas(getIdeas()) }, [])
  if (!mounted) return null

  const addIdea = () => {
    if (!form.title.trim()) return
    const user = getUser()
    const idea: Idea = {
      id: `i${Date.now()}`, title: form.title.trim(), description: form.description.trim(),
      status: 'nueva', author: user?.id || 'unknown', createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [...ideas, idea]
    setIdeas(updated)
    saveIdeas(updated)
    addActivity(user?.id || 'unknown', 'creó idea', form.title.trim())
    setForm({ title: '', description: '' })
    setShowForm(false)
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Lightbulb size={22} className="text-amber-400" /> Ideas
          </h1>
          <p className="text-gray-400 text-sm mt-1">Board de ideas del equipo</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={16} /> Nueva idea
        </button>
      </div>

      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Título de la idea" onKeyDown={e => e.key === 'Enter' && !e.shiftKey && addIdea()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-20 resize-none" />
          <div className="flex gap-2">
            <button onClick={addIdea} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl">Agregar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2">Cancelar</button>
          </div>
        </div>
      )}

      {/* Kanban - scrollable on mobile */}
      <div className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        {COLUMNS.map(col => {
          const colIdeas = ideas.filter(i => i.status === col.key)
          return (
            <div key={col.key} className="min-w-[260px] flex-1">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-sm font-medium text-gray-300">{col.label}</span>
                <span className="text-[10px] bg-white/5 text-gray-500 px-2 py-0.5 rounded-full">{colIdeas.length}</span>
              </div>
              <div className="space-y-2">
                {colIdeas.map(idea => {
                  const author = TEAM_USERS.find(u => u.id === idea.author)
                  return (
                    <div key={idea.id} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3.5 hover:border-white/10 transition-all group">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-white">{idea.title}</h4>
                        <button onClick={() => deleteIdea(idea.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                      {idea.description && <p className="text-[11px] text-gray-400 mt-1.5 line-clamp-2">{idea.description}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center" style={{ background: `${author?.color || '#666'}20` }}>{author?.avatar}</span>
                          <span className="text-[10px] text-gray-500">{idea.createdAt}</span>
                        </div>
                        {/* Move buttons */}
                        <select
                          value={idea.status}
                          onChange={e => moveIdea(idea.id, e.target.value as Idea['status'])}
                          className="text-[10px] bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-gray-400 focus:outline-none cursor-pointer"
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
