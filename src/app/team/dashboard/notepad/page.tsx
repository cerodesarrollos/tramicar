'use client'
import { useEffect, useState, useRef } from 'react'
import { getUser, addActivity } from '../../store'
import { createClient } from '@/lib/supabase/client'
import { TEAM_USERS } from '../../data'
import type { TeamUser } from '../../data'
import { StickyNote, Send, Sparkles, Loader2, CheckCircle2, Clock, Trash2 } from 'lucide-react'

interface Note {
  id: string
  user_id: string
  content: string
  processed: boolean
  processed_result: string | null
  ai_suggestion: string | null
  created_at: string
}

export default function NotepadPage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [text, setText] = useState('')
  const [user, setUser] = useState<TeamUser | null>(null)
  const [mounted, setMounted] = useState(false)
  const [processing, setProcessing] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setMounted(true)
    setUser(getUser())
    loadNotes()
  }, [])

  const loadNotes = async () => {
    try {
      const { data } = await createClient().from('notepad').select('*').order('created_at', { ascending: false })
      if (data) setNotes(data)
    } catch {}
  }

  if (!mounted) return null

  const addNote = async () => {
    if (!text.trim()) return
    const note: Note = {
      id: `n${Date.now()}`,
      user_id: user?.id || 'unknown',
      content: text.trim(),
      processed: false,
      processed_result: null,
      ai_suggestion: null,
      created_at: new Date().toISOString(),
    }
    setNotes([note, ...notes])
    setText('')
    textareaRef.current?.focus()
    try {
      await createClient().from('notepad').insert(note)
      addActivity(user?.id || 'unknown', 'escribió nota', text.trim().slice(0, 60) + (text.length > 60 ? '...' : ''))
    } catch (e) { console.error('addNote error', e) }
  }

  const deleteNote = async (id: string) => {
    setNotes(notes.filter(n => n.id !== id))
    try { await createClient().from('notepad').delete().eq('id', id) } catch {}
  }

  const processNote = async (note: Note) => {
    setProcessing(note.id)
    const sb = createClient()

    try {
      // Call AI classification API
      const res = await fetch('/api/classify-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: note.content, userId: note.user_id }),
      })

      if (!res.ok) throw new Error('Classification failed')
      const ai = await res.json()

      const category = ai.category || 'idea'
      const title = ai.title || note.content.slice(0, 80)
      const description = ai.description || note.content
      const priority = ai.priority || 'media'
      let details = ''

      switch (category) {
        case 'traba': {
          await sb.from('blockers').insert({
            id: `b${Date.now()}`, title, description, priority,
            assignee: note.user_id, status: 'abierta', created_at: note.created_at,
          })
          details = `→ Trabas (${priority})`
          break
        }
        case 'riesgo': {
          await sb.from('risks').insert({
            id: `rk${Date.now()}`, title, description,
            probability: priority, impact: priority === 'alta' ? 'alto' : 'medio',
            mitigation: '', owner: note.user_id, status: 'activo',
            category: 'operativo', created_at: note.created_at,
          })
          details = '→ Riesgos'
          break
        }
        case 'recurso': {
          const urlMatch = note.content.match(/https?:\/\/[^\s]+/)
          await sb.from('resources').insert({
            id: `r${Date.now()}`, title, url: urlMatch?.[0] || '#', type: 'link',
            added_by: note.user_id, created_at: note.created_at,
          })
          details = '→ Recursos'
          break
        }
        case 'decision': {
          await sb.from('decisions').insert({
            id: `d${Date.now()}`, date: note.created_at.split('T')[0], title,
            context: description, decision: title,
            alternatives: [], rationale: description,
            decided_by: [note.user_id], impact: priority, category: 'producto',
          })
          details = '→ Decisiones'
          break
        }
        default: {
          await sb.from('ideas').insert({
            id: `i${Date.now()}`, title, description,
            status: 'nueva', author: note.user_id, created_at: note.created_at,
          })
          details = '→ Ideas (nueva)'
          break
        }
      }

      const result = `${ai.summary || `Clasificado como ${category}`} ${details}`
      await sb.from('notepad').update({ processed: true, processed_result: result, ai_suggestion: ai.suggestion || null }).eq('id', note.id)
      setNotes(notes.map(n => n.id === note.id ? { ...n, processed: true, processed_result: result, ai_suggestion: ai.suggestion || null } : n))
      addActivity(note.user_id, 'procesó nota', `${title} ${details}`)
    } catch (e) {
      console.error('processNote error', e)
    }
    setProcessing(null)
  }

  const myNotes = notes.filter(n => n.user_id === user?.id)
  const otherNotes = notes.filter(n => n.user_id !== user?.id)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-gray-900 flex items-center gap-3">
          <StickyNote size={24} className="text-yellow-500" /> Notepad
        </h1>
        <p className="text-gray-500 text-sm mt-1.5">Escribí lo que se te ocurra. Después lo ordenamos al dashboard.</p>
      </div>

      {/* Input */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote() }}
          placeholder="Tirá una idea, anotá algo, lo que sea..."
          className="w-full bg-transparent text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none resize-none min-h-[80px]"
          autoFocus
        />
        <div className="flex items-center justify-between mt-2 pt-3 border-t border-gray-100">
          <span className="text-[10px] text-gray-400">⌘ + Enter para enviar</span>
          <button
            onClick={addNote}
            disabled={!text.trim()}
            className="dash-btn-primary disabled:opacity-30 disabled:cursor-not-allowed text-xs"
          >
            <Send size={13} /> Guardar
          </button>
        </div>
      </div>

      {/* My Notes */}
      {myNotes.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Mis notas</h3>
          <div className="space-y-2.5">
            {myNotes.map(note => (
              <NoteCard key={note.id} note={note} onProcess={processNote} onDelete={deleteNote} processing={processing} />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes */}
      {otherNotes.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-400 uppercase tracking-wider mb-3 font-semibold">Notas del equipo</h3>
          <div className="space-y-2.5">
            {otherNotes.map(note => (
              <NoteCard key={note.id} note={note} onProcess={processNote} onDelete={deleteNote} processing={processing} showAuthor />
            ))}
          </div>
        </div>
      )}

      {notes.length === 0 && (
        <div className="text-center py-12">
          <StickyNote size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Todavía no hay notas. ¡Arrancá!</p>
        </div>
      )}
    </div>
  )
}

function NoteCard({ note, onProcess, onDelete, processing, showAuthor }: {
  note: Note; onProcess: (n: Note) => void; onDelete: (id: string) => void; processing: string | null; showAuthor?: boolean
}) {
  const author = TEAM_USERS.find(u => u.id === note.user_id)
  const isProcessing = processing === note.id
  const time = new Date(note.created_at).toLocaleString('es-AR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })

  return (
    <div className={`bg-white border rounded-xl p-4 transition-all group shadow-sm ${note.processed ? 'border-emerald-200' : 'border-gray-100 hover:shadow-md hover:-translate-y-[1px]'}`}>
      <div className="flex items-start gap-3">
        {showAuthor && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: `${author?.color || '#666'}12` }}>
            {author?.avatar || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-700 whitespace-pre-wrap">{note.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-gray-400 flex items-center gap-1">
              <Clock size={10} /> {time}
            </span>
            {showAuthor && <span className="text-[10px] text-gray-400">{author?.name}</span>}
            {note.processed && note.processed_result && (
              <span className="text-[10px] text-emerald-600 flex items-center gap-1 font-medium">
                <CheckCircle2 size={10} /> {note.processed_result}
              </span>
            )}
          </div>
          {note.processed && note.ai_suggestion && (
            <div className="mt-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-lg">
              <p className="text-[10px] text-indigo-600 uppercase tracking-wider mb-0.5 flex items-center gap-1 font-semibold">
                <Sparkles size={10} /> Sugerencia IA
              </p>
              <p className="text-xs text-gray-600">{note.ai_suggestion}</p>
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          {!note.processed && (
            <button
              onClick={() => onProcess(note)}
              disabled={isProcessing}
              className="text-gray-400 hover:text-yellow-500 p-1.5 rounded-lg hover:bg-gray-50 transition-all disabled:opacity-50"
              title="Ordenar e integrar al dashboard"
            >
              {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            </button>
          )}
          <button
            onClick={() => onDelete(note.id)}
            className="text-gray-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-gray-50 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
