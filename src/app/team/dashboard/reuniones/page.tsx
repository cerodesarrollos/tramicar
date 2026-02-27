'use client'
import { useEffect, useState } from 'react'
import { getMeetings, saveMeetings, addActivity, getUser } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Meeting } from '../../data'
import { Users, Plus, ChevronDown, ChevronRight, CheckCircle2, Circle, Calendar, X } from 'lucide-react'

export default function ReunionesPage() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [expanded, setExpanded] = useState<string[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', notes: '' })
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

  const addMeeting = () => {
    if (!form.title.trim()) return
    const user = getUser()
    const newMeeting: Meeting = {
      id: `m${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: form.title,
      attendees: [user?.id || 'matias'],
      notes: form.notes,
      actionItems: [],
    }
    const updated = [newMeeting, ...meetings]
    setMeetings(updated)
    saveMeetings(updated)
    addActivity(user?.id || 'unknown', 'creó reunión', form.title)
    setForm({ title: '', notes: '' })
    setShowForm(false)
    setExpanded([newMeeting.id])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
            <Users size={22} className="text-violet-400" /> Reuniones
          </h1>
          <p className="text-gray-400 text-sm mt-1">Historial y action items</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl flex items-center gap-2 transition-colors">
          <Plus size={16} /> Nueva
        </button>
      </div>

      {/* New meeting form */}
      {showForm && (
        <div className="bg-white/[0.03] border border-indigo-500/20 rounded-2xl p-5 space-y-3">
          <input
            autoFocus value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
            placeholder="Título de la reunión" onKeyDown={e => e.key === 'Enter' && addMeeting()}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50"
          />
          <textarea
            value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })}
            placeholder="Notas..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-gray-600 focus:outline-none focus:border-indigo-500/50 h-24 resize-none"
          />
          <div className="flex gap-2">
            <button onClick={addMeeting} className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm px-4 py-2 rounded-xl transition-colors">Guardar</button>
            <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-200 text-sm px-4 py-2 transition-colors">Cancelar</button>
          </div>
        </div>
      )}

      {/* Meetings list */}
      <div className="space-y-3">
        {meetings.map(meeting => {
          const isOpen = expanded.includes(meeting.id)
          const doneActions = meeting.actionItems.filter(a => a.done).length
          return (
            <div key={meeting.id} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/10 transition-all">
              <button onClick={() => toggle(meeting.id)} className="w-full text-left px-5 py-4 flex items-center gap-3">
                {isOpen ? <ChevronDown size={16} className="text-gray-400 shrink-0" /> : <ChevronRight size={16} className="text-gray-400 shrink-0" />}
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{meeting.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[11px] text-gray-500 flex items-center gap-1"><Calendar size={11} /> {meeting.date}</span>
                    <div className="flex -space-x-1.5">
                      {meeting.attendees.map(id => {
                        const u = TEAM_USERS.find(u => u.id === id)
                        return <span key={id} className="w-5 h-5 rounded-full text-[10px] flex items-center justify-center ring-1 ring-[#0a0a0f]" style={{ background: `${u?.color || '#666'}30` }}>{u?.avatar}</span>
                      })}
                    </div>
                  </div>
                </div>
                {meeting.actionItems.length > 0 && (
                  <span className="text-[11px] text-gray-500">{doneActions}/{meeting.actionItems.length} items</span>
                )}
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 space-y-3">
                  {meeting.notes && (
                    <div className="bg-white/[0.02] rounded-xl p-3 text-xs text-gray-300 leading-relaxed">{meeting.notes}</div>
                  )}
                  {meeting.actionItems.length > 0 && (
                    <div>
                      <p className="text-[11px] text-gray-500 uppercase tracking-wider mb-2">Action Items</p>
                      <div className="space-y-1.5">
                        {meeting.actionItems.map((item, i) => {
                          const u = TEAM_USERS.find(u => u.id === item.assignee)
                          return (
                            <button key={i} onClick={() => toggleAction(meeting.id, i)} className="w-full flex items-center gap-3 text-left py-1 group">
                              {item.done ? <CheckCircle2 size={15} className="text-emerald-400 shrink-0" /> : <Circle size={15} className="text-gray-600 group-hover:text-indigo-400 shrink-0" />}
                              <span className={`text-xs flex-1 ${item.done ? 'text-gray-500 line-through' : 'text-gray-300'}`}>{item.text}</span>
                              <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${u?.color || '#666'}15`, color: u?.color || '#666' }}>{u?.name}</span>
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
