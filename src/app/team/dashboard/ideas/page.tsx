'use client'
import { useEffect, useState } from 'react'
import { getIdeas, saveIdeas, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Idea } from '../../data'
import { Lightbulb, Plus, Pencil, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeIn = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.06 } } }

const COLUMNS: { key: Idea['status']; label: string; color: string; bg: string }[] = [
  { key: 'nueva', label: '💡 Nueva', color: '#4338ca', bg: '#eef2ff' },
  { key: 'evaluando', label: '🔍 Evaluando', color: '#d97706', bg: '#fffbeb' },
  { key: 'aprobada', label: '✅ Aprobada', color: '#16a34a', bg: '#f0fdf4' },
  { key: 'descartada', label: '❌ Descartada', color: '#6b7280', bg: '#f9fafb' },
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
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={stagger}>
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
              <Lightbulb size={20} className="text-amber-500" />
            </div>
            Ideas
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">Board de ideas del equipo</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditingId(null); setForm({ title: '', description: '' }) }} className="dash-btn-primary">
          <Plus size={16} /> Nueva idea
        </button>
      </motion.div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-3 shadow-sm">
              <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                placeholder="Título de la idea" onKeyDown={e => e.key === 'Enter' && !e.shiftKey && saveIdea()}
                className="dash-input" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Descripción..."
                className="dash-textarea h-20" />
              <div className="flex gap-2 pt-1">
                <button onClick={saveIdea} className="dash-btn-primary">Agregar</button>
                <button onClick={() => setShowForm(false)} className="dash-btn-secondary">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Kanban */}
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0">
        {COLUMNS.map(col => {
          const colIdeas = ideas.filter(i => i.status === col.key)
          return (
            <div key={col.key} className="min-w-[260px] flex-1">
              <div className="flex items-center gap-2 mb-3 px-1">
                <span className="text-sm font-semibold text-gray-700">{col.label}</span>
                <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{colIdeas.length}</span>
              </div>
              <div className="space-y-2.5">
                {colIdeas.map((idea, i) => {
                  const author = TEAM_USERS.find(u => u.id === idea.author)
                  return (
                    <motion.div
                      key={idea.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
                      className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm transition-shadow group"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-gray-900">{idea.title}</h4>
                        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all shrink-0">
                          <button onClick={() => startEdit(idea)} className="text-gray-300 hover:text-indigo-500 p-0.5"><Pencil size={12} /></button>
                          <button onClick={() => deleteIdea(idea.id)} className="text-gray-300 hover:text-red-500 p-0.5"><Trash2 size={12} /></button>
                        </div>
                      </div>
                      {idea.description && <p className="text-[11px] text-gray-500 mt-1.5 line-clamp-2">{idea.description}</p>}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center" style={{ background: `${author?.color || '#666'}15` }}>{author?.avatar}</span>
                          <span className="text-[10px] text-gray-400">{idea.createdAt}</span>
                        </div>
                        <select
                          value={idea.status}
                          onChange={e => moveIdea(idea.id, e.target.value as Idea['status'])}
                          className="text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-500 focus:outline-none cursor-pointer"
                        >
                          {COLUMNS.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
                        </select>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </motion.div>
    </motion.div>
  )
}
