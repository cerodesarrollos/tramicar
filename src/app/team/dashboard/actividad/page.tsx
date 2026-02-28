'use client'
import { useEffect, useState } from 'react'
import { getActivities, saveActivities } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Activity } from '../../data'
import { Activity as ActivityIcon, Trash2, Pencil, X, Check } from 'lucide-react'
import { motion } from 'framer-motion'

const fadeIn = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.08 } } }

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
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={stagger}>
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <ActivityIcon size={20} className="text-indigo-600" />
          </div>
          Actividad
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">Timeline de todo lo que pasa en el equipo</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-gray-200" />

        <motion.div className="space-y-8" variants={stagger}>
          {Object.entries(grouped).map(([date, items], groupIdx) => (
            <motion.div key={date} variants={fadeIn} transition={{ duration: 0.4 }}>
              <div className="relative flex items-center gap-3 mb-4">
                <div className="w-[31px] h-[31px] bg-white border-2 border-indigo-200 rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <h3 className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{date}</h3>
              </div>

              <div className="ml-[31px] pl-6 space-y-3">
                {items.map((a, i) => {
                  const u = TEAM_USERS.find(u => u.id === a.user)
                  const time = new Date(a.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                  const isEditing = editingId === a.id
                  return (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="flex items-start gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: `${u?.color || '#666'}12` }}>
                        {u?.avatar || '?'}
                      </div>
                      <div className="flex-1 bg-white rounded-xl px-3.5 py-2.5 shadow-sm border border-gray-100 group-hover:shadow-md transition-shadow">
                        {isEditing ? (
                          <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                              <span className="font-medium text-gray-900 text-xs">{u?.name}</span>
                              <input value={editForm.action} onChange={e => setEditForm({ ...editForm, action: e.target.value })}
                                className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs text-gray-700 focus:outline-none focus:border-indigo-400 w-24" />
                              <input value={editForm.target} onChange={e => setEditForm({ ...editForm, target: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && saveEdit()}
                                className="bg-gray-50 border border-gray-200 rounded px-2 py-0.5 text-xs text-indigo-600 focus:outline-none focus:border-indigo-400 flex-1" />
                            </div>
                            <div className="flex gap-1">
                              <button onClick={saveEdit} className="text-emerald-500 hover:text-emerald-600 p-0.5"><Check size={14} /></button>
                              <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-0.5"><X size={14} /></button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex items-start justify-between">
                              <p className="text-xs text-gray-600">
                                <span className="font-medium text-gray-900">{u?.name}</span>{' '}
                                <span className="text-gray-500">{a.action}</span>{' '}
                                <span className="text-indigo-600">{a.target}</span>
                              </p>
                              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all ml-2 shrink-0">
                                <button onClick={() => startEdit(a)} className="text-gray-300 hover:text-indigo-500 p-1 rounded hover:bg-gray-50 transition-all"><Pencil size={12} /></button>
                                <button onClick={() => deleteActivity(a.id)} className="text-gray-300 hover:text-red-500 p-1 rounded hover:bg-gray-50 transition-all"><Trash2 size={12} /></button>
                              </div>
                            </div>
                            <p className="text-[10px] text-gray-400 mt-0.5">{time}</p>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {activities.length === 0 && (
        <motion.div variants={fadeIn} className="text-center py-16">
          <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ActivityIcon size={28} className="text-indigo-300" />
          </div>
          <p className="text-gray-400 text-sm">Sin actividad registrada todavía</p>
        </motion.div>
      )}
    </motion.div>
  )
}
