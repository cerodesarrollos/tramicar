'use client'
import { useEffect, useState } from 'react'
import { getMeetings, saveMeetings, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Meeting } from '../../data'
import { Users, Plus, ChevronDown, ChevronRight, CheckCircle2, Circle, Calendar, Pencil, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const fadeIn = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } }
const stagger = { animate: { transition: { staggerChildren: 0.06 } } }

export default function ReunionesPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', notes: '', date: '' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    async function load() {
      const m = await getMeetings()
      setMeetings(m)
      if (m[0]) setExpanded([m[0].id])
    }
    load()
  }, [])

  if (!mounted) return null

  const toggle = (id: string) => setExpanded(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id])

  const toggleAction = (meetingId: string, idx: number) => {
    const updated = meetings.map(m => {
      if (m.id !== meetingId) return m
      const items = [...m.actionItems]
      items[idx] = { ...items[idx], done: !items[idx].done }
      return { ...m, actionItems: items }
    })
    setMeetings(updated)
    saveMeetings(updated)
  }

  const resetForm = () => {
    setForm({ title: '', notes: '', date: '' })
    setShowForm(false)
    setEditingId(null)
  }

  const startEdit = (m: Meeting) => {
    setForm({ title: m.title, notes: m.notes, date: m.date })
    setEditingId(m.id)
    setShowForm(true)
  }

  const saveMeeting = () => {
    if (!form.title.trim()) return
    const user = getUser()
    if (editingId) {
      const updated = meetings.map(m => m.id === editingId ? { ...m, title: form.title, notes: form.notes, date: form.date || m.date } : m)
      setMeetings(updated)
      saveMeetings(updated)
      addActivity(user?.id || 'unknown', 'editó reunión', form.title)
    } else {
      const newMeeting: Meeting = {
        id: `m${Date.now()}`, date: form.date || new Date().toISOString().split('T')[0],
        title: form.title, attendees: [user?.id || 'matias'], notes: form.notes, actionItems: [],
      }
      const updated = [newMeeting, ...meetings]
      setMeetings(updated)
      saveMeetings(updated)
      addActivity(user?.id || 'unknown', 'creó reunión', form.title)
      setExpanded([newMeeting.id])
    }
    resetForm()
  }

  const deleteMeeting = (id: string) => {
    const m = meetings.find(x => x.id === id)
    const updated = meetings.filter(x => x.id !== id)
    setMeetings(updated)
    saveMeetings(updated)
    if (m) addActivity(getUser()?.id || 'unknown', 'eliminó reunión', m.title)
  }

  return (
    <motion.div className="space-y-8" initial="initial" animate="animate" variants={stagger}>
      <motion.div variants={fadeIn} transition={{ duration: 0.4 }} className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center">
              <Users size={20} className="text-violet-500" />
            </div>
            Reuniones
          </h1>
          <p className="text-gray-500 text-sm mt-1.5">Historial y action items</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="dash-btn-primary">
          <Plus size={16} /> Nueva
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
              <div className="flex gap-3">
                <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Título de la reunión" onKeyDown={e => e.key === 'Enter' && saveMeeting()}
                  className="dash-input flex-1" />
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
                  className="dash-input w-auto" />
              </div>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
                placeholder="Notas..."
                className="dash-textarea h-24" />
              <div className="flex gap-2 pt-1">
                <button onClick={saveMeeting} className="dash-btn-primary">{editingId ? 'Actualizar' : 'Guardar'}</button>
                <button onClick={resetForm} className="dash-btn-secondary">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="space-y-3" variants={stagger}>
        {meetings.map(meeting => {
          const isOpen = expanded.includes(meeting.id)
          const doneActions = meeting.actionItems.filter(a => a.done).length
          return (
            <motion.div
              key={meeting.id}
              variants={fadeIn}
              transition={{ duration: 0.3 }}
              whileHover={{ y: -1 }}
              className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group/card"
            >
              <div className="flex items-center">
                <button onClick={() => toggle(meeting.id)} className="flex-1 text-left px-5 py-4 flex items-center gap-3">
                  {isOpen ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{meeting.title}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1"><Calendar size={11} /> {meeting.date}</span>
                      <div className="flex -space-x-1.5">
                        {meeting.attendees.map(id => {
                          const u = TEAM_USERS.find(u => u.id === id)
                          return <span key={id} className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center ring-2 ring-white" style={{ background: `${u?.color || '#666'}20` }}>{u?.avatar}</span>
                        })}
                      </div>
                    </div>
                  </div>
                  {meeting.actionItems.length > 0 && (
                    <span className="text-[11px] text-gray-400 font-medium">{doneActions}/{meeting.actionItems.length} items</span>
                  )}
                </button>
                <div className="flex items-center gap-1 pr-4 opacity-0 group-hover/card:opacity-100 transition-all">
                  <button onClick={() => startEdit(meeting)} className="text-gray-300 hover:text-indigo-500 p-1.5 rounded-lg hover:bg-gray-50 transition-all"><Pencil size={14} /></button>
                  <button onClick={() => deleteMeeting(meeting.id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-50 transition-all"><Trash2 size={14} /></button>
                </div>
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-0 space-y-3">
                      {meeting.notes && (
                        <div className="bg-gray-50 rounded-lg p-3.5 text-xs text-gray-600 leading-relaxed whitespace-pre-line">{meeting.notes}</div>
                      )}
                      {meeting.actionItems.length > 0 && (
                        <div>
                          <p className="text-[11px] text-gray-400 uppercase tracking-wider mb-2 font-semibold">Action Items</p>
                          <div className="space-y-1.5">
                            {meeting.actionItems.map((item, i) => {
                              const u = TEAM_USERS.find(u => u.id === item.assignee)
                              return (
                                <button key={i} onClick={() => toggleAction(meeting.id, i)} className="w-full flex items-center gap-3 text-left py-1 group rounded-lg hover:bg-gray-50 px-2 -mx-2 transition-colors">
                                  {item.done ? <CheckCircle2 size={15} className="text-emerald-500 shrink-0" /> : <Circle size={15} className="text-gray-300 group-hover:text-indigo-500 shrink-0 transition-colors" />}
                                  <span className={`text-xs flex-1 ${item.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.text}</span>
                                  <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${u?.color || '#666'}10`, color: u?.color || '#666' }}>{u?.name}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </motion.div>

      {meetings.length === 0 && (
        <motion.div variants={fadeIn} className="text-center py-16">
          <div className="w-16 h-16 bg-violet-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users size={28} className="text-violet-300" />
          </div>
          <p className="text-gray-400 text-sm">Sin reuniones registradas todavía</p>
        </motion.div>
      )}
    </motion.div>
  )
}
