'use client'
import { useEffect, useState } from 'react'
import { getBlockers, saveBlockers, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Blocker } from '../../data'
import { AlertTriangle, Plus, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeIn = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.06 } } }

const PRIORITY_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  alta: { bg: 'bg-red-50 border-red-100', text: 'text-red-600', label: '🔴 Alta' },
  media: { bg: 'bg-amber-50 border-amber-100', text: 'text-amber-600', label: '🟡 Media' },
  baja: { bg: 'bg-gray-50 border-gray-100', text: 'text-gray-500', label: '⚪ Baja' },
}

const STATUS_STYLES: Record<string, { bg: string; label: string }> = {
  'abierta': { bg: 'bg-red-50 text-red-600', label: 'Abierta' },
  'en-progreso': { bg: 'bg-amber-50 text-amber-600', label: 'En progreso' },
  'resuelta': { bg: 'bg-emerald-50 text-emerald-600', label: 'Resuelta' },
}

export default function TrabasPage() {
  const [blockers, setBlockers] = useState<Blocker[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', priority: 'media' as Blocker['priority'], assignee: '' })
  const [filter, setFilter] = useState<'all' | 'abierta' | 'en-progreso' | 'resuelta'>('all')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    getBlockers().then(setBlockers)
    setForm(f => ({ ...f, assignee: getUser()?.id || 'matias' }))
  }, [])

  if (!mounted) return null

  const addBlocker = () => {
    if (!form.title.trim()) return
    const user = getUser()
    const b: Blocker = {
      id: `b${Date.now()}`, title: form.title.trim(), description: form.description.trim(),
      priority: form.priority, assignee: form.assignee, status: 'abierta',
      createdAt: new Date().toISOString().split('T')[0],
    }
    const updated = [b, ...blockers]
    setBlockers(updated)
    saveBlockers(updated)
    addActivity(user?.id || 'unknown', 'reportó traba', form.title.trim())
    setForm({ title: '', description: '', priority: 'media', assignee: user?.id || 'matias' })
    setShowForm(false)
  }

  const updateStatus = (id: string, status: Blocker['status']) => {
    const updated = blockers.map(b => b.id === id ? { ...b, status } : b)
    setBlockers(updated)
    saveBlockers(updated)
    const b = updated.find(x => x.id === id)
    if (b) addActivity(getUser()?.id || 'unknown', status === 'resuelta' ? 'resolvió' : 'actualizó', b.title)
  }

  const deleteBlocker = (id: string) => {
    const b = blockers.find(x => x.id === id)
    const updated = blockers.filter(x => x.id !== id)
    setBlockers(updated)
    saveBlockers(updated)
    if (b) addActivity(getUser()?.id || 'unknown', 'eliminó traba', b.title)
  }

  const filtered = filter === 'all' ? blockers : blockers.filter(b => b.status === filter)

  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={stagger}>
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            Trabas
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">Blockers y problemas a resolver</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="dash-btn-primary">
          <Plus size={16} /> Reportar
        </button>
      </motion.div>

      {/* Filter */}
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="flex gap-2">
        {([['all', 'Todas'], ['abierta', 'Abiertas'], ['en-progreso', 'En progreso'], ['resuelta', 'Resueltas']] as const).map(([key, label]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`text-xs px-4 py-2 rounded-full transition-all duration-200 font-medium ${filter === key ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 bg-white border border-gray-200 hover:border-gray-300'}`}>
            {label}
          </button>
        ))}
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
                placeholder="¿Qué está bloqueando?"
                className="dash-input" />
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Detalle..."
                className="dash-textarea h-20" />
              <div className="flex gap-3">
                <select value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value as Blocker['priority'] })}
                  className="dash-select">
                  <option value="alta">🔴 Alta</option><option value="media">🟡 Media</option><option value="baja">⚪ Baja</option>
                </select>
                <select value={form.assignee} onChange={e => setForm({ ...form, assignee: e.target.value })}
                  className="dash-select">
                  {TEAM_USERS.map(u => <option key={u.id} value={u.id}>{u.avatar} {u.name}</option>)}
                </select>
              </div>
              <div className="flex gap-2 pt-1">
                <button onClick={addBlocker} className="dash-btn-primary">Reportar</button>
                <button onClick={() => setShowForm(false)} className="dash-btn-secondary">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blockers list */}
      <motion.div className="space-y-3" variants={stagger}>
        {filtered.map(b => {
          const ps = PRIORITY_STYLES[b.priority]
          const ss = STATUS_STYLES[b.status]
          const assignee = TEAM_USERS.find(u => u.id === b.assignee)
          return (
            <motion.div
              key={b.id}
              variants={fadeIn}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -1 }}
              className={`${ps.bg} border rounded-xl p-5 group transition-shadow hover:shadow-sm`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-gray-900">{b.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${ss.bg}`}>{ss.label}</span>
                  </div>
                  {b.description && <p className="text-xs text-gray-500 mt-1.5">{b.description}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="flex items-center gap-1.5 text-[11px] text-gray-600">
                      <span className="w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: `${assignee?.color}15` }}>{assignee?.avatar}</span>
                      {assignee?.name}
                    </span>
                    <span className="text-[10px] text-gray-400">{b.createdAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <select value={b.status} onChange={e => updateStatus(b.id, e.target.value as Blocker['status'])}
                    className="text-[10px] bg-white border border-gray-200 rounded-lg px-2 py-1 text-gray-500 focus:outline-none cursor-pointer">
                    <option value="abierta">Abierta</option><option value="en-progreso">En progreso</option><option value="resuelta">Resuelta</option>
                  </select>
                  <button onClick={() => deleteBlocker(b.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {filtered.length === 0 && (
        <motion.div variants={fadeIn} className="text-center py-16">
          <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={28} className="text-gray-300" />
          </div>
          <p className="text-gray-400 text-sm">Sin trabas en esta categoría</p>
        </motion.div>
      )}
    </motion.div>
  )
}
