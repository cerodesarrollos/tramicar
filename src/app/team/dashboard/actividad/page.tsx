'use client'
import { useEffect, useState } from 'react'
import { getActivities, saveActivities } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Activity } from '../../data'
import { Activity as ActivityIcon, Trash2, Pencil, X, Check } from 'lucide-react'

export default function ActividadPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [mounted, setMounted] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ action: '', target: '' })

  useEffect(() => { setMounted(true); getActivities().then(setActivities) }, [])
  if (!mounted) return null

  const deleteActivity = (id: string) => {
    const updated = activities.filter(a => a.id !== id)
    setActivities(updated)
    saveActivities(updated)
  }

  const startEdit = (a: Activity) => {
    setEditingId(a.id)
    setEditForm({ action: a.action, target: a.target })
  }

  const saveEdit = () => {
    if (!editingId) return
    const updated = activities.map(a => a.id === editingId ? { ...a, action: editForm.action, target: editForm.target } : a)
    setActivities(updated)
    saveActivities(updated)
    setEditingId(null)
  }

  // Group by date
  const grouped: Record<string, Activity[]> = {}
  activities.forEach(a => {
    const date = new Date(a.timestamp).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(a)
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 flex items-center justify-center">
            <ActivityIcon size={18} className="text-indigo-400" />
          </div>
          Actividad
        </h1>
        <p className="text-gray-500 text-sm mt-2 ml-12">Timeline de todo lo que pasa en el equipo</p>
      </div>

      <div className="relative ml-1">
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500/20 via-white/[0.06] to-transparent" />

        <div className="space-y-8">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="relative flex items-center gap-3 mb-4">
                <div className="w-[31px] h-[31px] bg-[#0d0d18] border-2 border-indigo-500/25 rounded-full flex items-center justify-center z-10 shadow-[0_0_10px_rgba(99,102,241,0.15)]">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <h3 className="text-xs font-semibold text-indigo-400/80 uppercase tracking-widest">{date}</h3>
              </div>

              <div className="ml-[31px] pl-6 space-y-2.5">
                {items.map(a => {
                  const u = TEAM_USERS.find(u => u.id === a.user)
                  const time = new Date(a.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                  const isEditing = editingId === a.id
                  return (
                    <div key={a.id} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-sm shrink-0 ring-1 ring-white/[0.04] group-hover:ring-white/[0.08] transition-all" style={{ background: `${u?.color || '#666'}12` }}>
                        {u?.avatar || '?'}
                      </div>
                      <div className="flex-1 bg-white/[0.02] rounded-xl px-4 py-3 border border-white/[0.04] group-hover:border-white/[0.08] transition-all">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2 items-center">
                              <span className="font-medium text-white text-[13px]">{u?.name}</span>
                              <input value={editForm.action} onChange={e => setEditForm({ ...editForm, action: e.target.value })}
                                className="premium-input !py-1 !px-2 !text-[12px] w-24" />
                              <input value={editForm.target} onChange={e => setEditForm({ ...editForm, target: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                className="premium-input !py-1 !px-2 !text-[12px] flex-1 !text-indigo-300" />
                            </div>
                            <div className="flex gap-1">
                              <button onClick={saveEdit} className="text-emerald-400 hover:text-emerald-300 p-1 rounded-md hover:bg-emerald-500/5 transition-all"><Check size={14} /></button>
                              <button onClick={() => setEditingId(null)} className="text-gray-600 hover:text-gray-300 p-1 rounded-md hover:bg-white/5 transition-all"><X size={14} /></button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between">
                              <p className="text-[13px] text-gray-400">
                                <span className="font-medium text-gray-200">{u?.name}</span>{' '}
                                <span className="text-gray-500">{a.action}</span>{' '}
                                <span className="text-indigo-400/80">{a.target}</span>
                              </p>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all ml-3 shrink-0">
                                <button onClick={() => startEdit(a)} className="text-gray-700 hover:text-indigo-400 p-1 rounded-md hover:bg-indigo-500/5 transition-all"><Pencil size={12} /></button>
                                <button onClick={() => deleteActivity(a.id)} className="text-gray-700 hover:text-red-400 p-1 rounded-md hover:bg-red-500/5 transition-all"><Trash2 size={12} /></button>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-700 mt-1">{time}</p>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {activities.length === 0 && (
        <div className="text-center py-16">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-3">
            <ActivityIcon size={20} className="text-gray-700" />
          </div>
          <p className="text-gray-600 text-sm">Sin actividad registrada todavía</p>
        </div>
      )}
    </div>
  )
}
