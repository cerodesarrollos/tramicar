'use client'
import { useEffect, useState } from 'react'
import { getResources, saveResources, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Resource } from '../../data'
import { FolderOpen, Plus, ExternalLink, X, Github, FileText, Link2, Wrench } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeIn = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.06 } } }

const TYPE_CONFIG: Record<string, { icon: typeof Github; color: string; bg: string; label: string }> = {
  repo: { icon: Github, color: '#4338ca', bg: '#eef2ff', label: 'Repositorio' },
  doc: { icon: FileText, color: '#16a34a', bg: '#f0fdf4', label: 'Documento' },
  link: { icon: Link2, color: '#d97706', bg: '#fffbeb', label: 'Link' },
  tool: { icon: Wrench, color: '#db2777', bg: '#fdf2f8', label: 'Herramienta' },
}

export default function RecursosPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', url: '', type: 'link' as Resource['type'] })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); getResources().then(setResources) }, [])
  if (!mounted) return null

  const addResource = () => {
    if (!form.title.trim() || !form.url.trim()) return
    const user = getUser()
    const r: Resource = {
      id: `r${Date.now()}`, title: form.title.trim(), url: form.url.trim(),
      type: form.type, addedBy: user?.id || 'unknown', addedAt: new Date().toISOString().split('T')[0],
    }
    const updated = [...resources, r]
    setResources(updated)
    saveResources(updated)
    addActivity(user?.id || 'unknown', 'agregó recurso', form.title.trim())
    setForm({ title: '', url: '', type: 'link' })
    setShowForm(false)
  }

  const deleteResource = (id: string) => {
    const r = resources.find(x => x.id === id)
    const updated = resources.filter(x => x.id !== id)
    setResources(updated)
    saveResources(updated)
    if (r) addActivity(getUser()?.id || 'unknown', 'eliminó recurso', r.title)
  }

  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={stagger}>
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <FolderOpen size={20} className="text-emerald-500" />
            </div>
            Recursos
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">Links, docs y herramientas del proyecto</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="dash-btn-primary">
          <Plus size={16} /> Agregar
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
                placeholder="Nombre del recurso"
                className="dash-input" />
              <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
                placeholder="URL"
                className="dash-input" />
              <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Resource['type'] })}
                className="dash-select">
                <option value="repo">📦 Repositorio</option><option value="doc">📄 Documento</option>
                <option value="link">🔗 Link</option><option value="tool">🔧 Herramienta</option>
              </select>
              <div className="flex gap-2 pt-1">
                <button onClick={addResource} className="dash-btn-primary">Agregar</button>
                <button onClick={() => setShowForm(false)} className="dash-btn-secondary">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Resources grid */}
      <motion.div className="grid md:grid-cols-2 gap-4" variants={stagger}>
        {resources.map((r, i) => {
          const config = TYPE_CONFIG[r.type]
          const Icon = config.icon
          const addedBy = TEAM_USERS.find(u => u.id === r.addedBy)
          return (
            <motion.div
              key={r.id}
              variants={fadeIn}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -2, boxShadow: '0 8px 25px -5px rgba(0,0,0,0.08)' }}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm transition-shadow group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: config.bg }}>
                  <Icon size={18} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 truncate">{r.title}</h3>
                  <p className="text-[11px] text-gray-400 mt-0.5 truncate">{r.url}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: config.bg, color: config.color }}>{config.label}</span>
                    <span className="text-[10px] text-gray-400">por {addedBy?.name} · {r.addedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={r.url} target="_blank" rel="noopener" className="text-gray-400 hover:text-indigo-600 p-1 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                  <button onClick={() => deleteResource(r.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                    <X size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {resources.length === 0 && (
        <motion.div variants={fadeIn} className="text-center py-16">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={28} className="text-emerald-300" />
          </div>
          <p className="text-gray-400 text-sm">Sin recursos todavía. Agregá links, repos y docs.</p>
        </motion.div>
      )}
    </motion.div>
  )
}
