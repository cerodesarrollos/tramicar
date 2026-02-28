'use client'
import { useEffect, useState } from 'react'
import { getResources, saveResources, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Resource } from '../../data'
import { FolderOpen, Plus, ExternalLink, X, Github, FileText, Link2, Wrench, Pencil, Trash2 } from 'lucide-react'

const TYPE_CONFIG: Record<string, { icon: typeof Github; color: string; label: string }> = {
  repo: { icon: Github, color: '#818cf8', label: 'Repositorio' },
  doc: { icon: FileText, color: '#34d399', label: 'Documento' },
  link: { icon: Link2, color: '#f59e0b', label: 'Link' },
  tool: { icon: Wrench, color: '#f472b6', label: 'Herramienta' },
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <FolderOpen size={22} className="text-emerald-400" /> Recursos
          </h1>
          <p className="text-gray-400 text-sm mt-1">Links, docs y herramientas del proyecto</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={16} /> Agregar
        </button>
      </div>

      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
          <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Nombre del recurso"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50" />
          <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })}
            placeholder="URL"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50" />
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as Resource['type'] })}
            className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none">
            <option value="repo">📦 Repositorio</option><option value="doc">📄 Documento</option>
            <option value="link">🔗 Link</option><option value="tool">🔧 Herramienta</option>
          </select>
          <div className="flex gap-2">
            <button onClick={addResource} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl">Agregar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2">Cancelar</button>
          </div>
        </div>
      )}

      {/* Resources grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {resources.map(r => {
          const config = TYPE_CONFIG[r.type]
          const Icon = config.icon
          const addedBy = TEAM_USERS.find(u => u.id === r.addedBy)
          return (
            <div key={r.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 hover:border-white/10 transition-all group">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${config.color}15` }}>
                  <Icon size={18} style={{ color: config.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{r.title}</h3>
                  <p className="text-[11px] text-gray-500 mt-0.5 truncate">{r.url}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${config.color}15`, color: config.color }}>{config.label}</span>
                    <span className="text-[10px] text-gray-600">por {addedBy?.name} · {r.addedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a href={r.url} target="_blank" rel="noopener" className="text-gray-500 hover:text-indigo-400 p-1 transition-colors">
                    <ExternalLink size={14} />
                  </a>
                  <button onClick={() => deleteResource(r.id)} className="text-gray-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1">
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
