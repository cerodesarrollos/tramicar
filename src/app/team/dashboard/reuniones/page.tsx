'use client'
import { useEffect, useState } from 'react'
import { getMeetings, saveMeetings, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Meeting } from '../../data'
import { Users, Plus, ChevronDown, ChevronRight, CheckCircle2, Circle, Calendar, X, Pencil, Trash2 } from 'lucide-react'

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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-3 tracking-tight">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center">
              <Users size={18} className="text-violet-400" />
            </div>
            Reuniones
          </h1>
          <p className="text-gray-500 text-sm mt-2 ml-12">Historial y action items</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true) }} className="btn-primary flex items-center gap-2">
          <Plus size={15} /> Nueva
        </button>
      </div>

      {showForm && (
        <div className="glass-card !border-indigo-500/15 rounded-2xl p-6 space-y-3">
          <div className="flex gap-3">
            <input autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              placeholder="Título de la reunión" onKeyDown={e => e.key === 'Enter' && saveMeeting()}
              className="premium-input flex-1" />
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })}
              className="premium-input" />
          </div>
          <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Notas..."
            className="premium-input w-full h-24 resize-none" />
          <div className="flex gap-2 pt-1">
            <button onClick={saveMeeting} className="btn-primary">{editingId ? 'Actualizar' : 'Guardar'}</button>
            <button onClick={resetForm} className="text-gray-500 hover:text-gray-300 text-sm px-4 py-2 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {meetings.map(meeting => {
          const isOpen = expanded.includes(meeting.id)
          const doneActions = meeting.actionItems.filter(a => a.done).length
          return (
            <div key={meeting.id} className="glass-card rounded-2xl overflow-hidden group/card">
              <div className="flex items-center">
                <button onClick={() => toggle(meeting.id)} className="flex-1 text-left px-6 py-4 flex items-center gap-3">
                  {isOpen ? <ChevronDown size={15} className="text-gray-500 shrink-0" /> : <ChevronRight size={15} className="text-gray-500 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[13px] font-semibold text-white truncate">{meeting.title}</h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-gray-600 flex items-center gap-1.5"><Calendar size={11} className="text-gray-700" /> {meeting.date}</span>
                      <div className="flex -space-x-1.5">
                        {meeting.attendees.map(id => {
                          const u = TEAM_USERS.find(u => u.id === id)
                          return <span key={id} className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center ring-2 ring-[#0d0d18]" style={{ background: `${u?.color || '#666'}25` }}>{u?.avatar}</span>
                        })}
                      </div>
                    </div>
                  </div>
                  {meeting.actionItems.length > 0 && (
                    <span className="text-[11px] text-gray-600 font-mono">{doneActions}/{meeting.actionItems.length}</span>
                  )}
                </button>
                <div className="flex items-center gap-1 pr-5 opacity-0 group-hover/card:opacity-100 transition-all">
                  <button onClick={() => startEdit(meeting)} className="text-gray-700 hover:text-indigo-400 p-1.5 rounded-lg hover:bg-indigo-500/5 transition-all"><Pencil size={13} /></button>
                  <button onClick={() => deleteMeeting(meeting.id)} className="text-gray-700 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/5 transition-all"><Trash2 size={13} /></button>
                </div>
              </div>

              {isOpen && (
                <div className="px-6 pb-6 pt-0 space-y-4">
                  {meeting.notes && (
                    <div className="bg-white/[0.02] rounded-xl p-4 text-[13px] text-gray-400 leading-relaxed whitespace-pre-line border border-white/[0.04]">{meeting.notes}</div>
                  )}
                  {meeting.actionItems.length > 0 && (
                    <div>
                      <p className="text-[10px] text-gray-600 uppercase tracking-widest font-medium mb-3">Action Items</p>
                      <div className="space-y-1">
                        {meeting.actionItems.map((item, i) => {
                          const u = TEAM_USERS.find(u => u.id === item.assignee)
                          return (
                            <button key={i} onClick={() => toggleAction(meeting.id, i)} className="w-full flex items-center gap-3 text-left py-2 px-2 -mx-2 rounded-lg group hover:bg-white/[0.02] transition-all">
                              {item.done ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> : <Circle size={15} className="text-gray-600 group-hover:text-indigo-400 shrink-0 transition-colors" />}
                              <span className={`text-[13px] flex-1 ${item.done ? 'text-gray-600 line-through' : 'text-gray-300'}`}>{item.text}</span>
                              <span className="text-[10px] px-2.5 py-0.5 rounded-full font-medium" style={{ background: `${u?.color || '#666'}10`, color: u?.color || '#666' }}>{u?.name}</span>
                            </button>
                          )
                        })}
                      </div>
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
