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

    // Analyze content and determine where it should go
    const content = note.content.toLowerCase()
    let category = 'idea'
    let details = ''

    // Simple keyword-based classification
    if (content.includes('traba') || content.includes('bloqueado') || content.includes('problema') || content.includes('no se puede') || content.includes('falta')) {
      category = 'traba'
    } else if (content.includes('riesgo') || content.includes('peligro') || content.includes('cuidado')) {
      category = 'riesgo'
    } else if (content.includes('decidimos') || content.includes('decisión') || content.includes('definimos') || content.includes('elegimos')) {
      category = 'decisión'
    } else if (content.includes('recurso') || content.includes('link') || content.includes('http') || content.includes('repo') || content.includes('doc')) {
      category = 'recurso'
    } else if (content.includes('reunión') || content.includes('reunion') || content.includes('nos juntamos')) {
      category = 'reunión'
    }

    const sb = createClient()

    try {
      switch (category) {
        case 'traba': {
          await sb.from('blockers').insert({
            id: `b${Date.now()}`, title: note.content.slice(0, 80),
            description: note.content, priority: 'media',
            assignee: note.user_id, status: 'abierta', created_at: note.created_at,
          })
          details = '→ Trabas (prioridad media)'
          break
        }
        case 'riesgo': {
          await sb.from('risks').insert({
            id: `rk${Date.now()}`, title: note.content.slice(0, 80),
            description: note.content, probability: 'media', impact: 'medio',
            mitigation: '', owner: note.user_id, status: 'activo',
            category: 'operativo', created_at: note.created_at,
          })
          details = '→ Riesgos'
          break
        }
        case 'recurso': {
          const urlMatch = note.content.match(/https?:\/\/[^\s]+/)
          await sb.from('resources').insert({
            id: `r${Date.now()}`, title: note.content.slice(0, 80),
            url: urlMatch?.[0] || '#', type: 'link',
            added_by: note.user_id, created_at: note.created_at,
          })
          details = '→ Recursos'
          break
        }
        default: {
          await sb.from('ideas').insert({
            id: `i${Date.now()}`, title: note.content.slice(0, 80),
            description: note.content, status: 'nueva',
            author: note.user_id, created_at: note.created_at,
          })
          details = '→ Ideas (nueva)'
          break
        }
      }

      // Mark as processed
      const result = `Clasificado como ${category} ${details}`
      await sb.from('notepad').update({ processed: true, processed_result: result }).eq('id', note.id)
      setNotes(notes.map(n => n.id === note.id ? { ...n, processed: true, processed_result: result } : n))
      addActivity(note.user_id, 'procesó nota', `${note.content.slice(0, 40)}... ${details}`)
    } catch (e) {
      console.error('processNote error', e)
    }
    setProcessing(null)
  }

  const myNotes = notes.filter(n => n.user_id === user?.id)
  const otherNotes = notes.filter(n => n.user_id !== user?.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <StickyNote size={22} className="text-yellow-400" /> Notepad
        </h1>
        <p className="text-gray-400 text-sm mt-1">Escribí lo que se te ocurra. Después lo ordenamos al dashboard.</p>
      </div>

      {/* Input */}
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote() }}
          placeholder="Tirá una idea, anotá algo, lo que sea..."
          className="w-full bg-transparent text-white text-sm placeholder:text-gray-600 focus:outline-none resize-none min-h-[80px]"
          autoFocus
        />
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/[0.04]">
          <span className="text-[10px] text-gray-600">⌘ + Enter para enviar</span>
          <button
            onClick={addNote}
            disabled={!text.trim()}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed text-white text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Send size={13} /> Guardar
          </button>
        </div>
      </div>

      {/* My Notes */}
      {myNotes.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Mis notas</h3>
          <div className="space-y-2">
            {myNotes.map(note => (
              <NoteCard key={note.id} note={note} onProcess={processNote} onDelete={deleteNote} processing={processing} />
            ))}
          </div>
        </div>
      )}

      {/* Other Notes */}
      {otherNotes.length > 0 && (
        <div>
          <h3 className="text-xs text-gray-500 uppercase tracking-wider mb-3">Notas del equipo</h3>
          <div className="space-y-2">
            {otherNotes.map(note => (
              <NoteCard key={note.id} note={note} onProcess={processNote} onDelete={deleteNote} processing={processing} showAuthor />
            ))}
          </div>
        </div>
      )}

      {notes.length === 0 && (
        <div className="text-center py-12">
          <StickyNote size={32} className="text-gray-700 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">Todavía no hay notas. ¡Arrancá!</p>
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
    <div className={`bg-white/[0.03] border rounded-xl p-4 transition-all group ${note.processed ? 'border-emerald-500/10' : 'border-white/[0.06] hover:border-white/10'}`}>
      <div className="flex items-start gap-3">
        {showAuthor && (
          <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: `${author?.color || '#666'}15` }}>
            {author?.avatar || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-200 whitespace-pre-wrap">{note.content}</p>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] text-gray-600 flex items-center gap-1">
              <Clock size={10} /> {time}
            </span>
            {showAuthor && <span className="text-[10px] text-gray-600">{author?.name}</span>}
            {note.processed && note.processed_result && (
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={10} /> {note.processed_result}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all shrink-0">
          {!note.processed && (
            <button
              onClick={() => onProcess(note)}
              disabled={isProcessing}
              className="text-gray-500 hover:text-yellow-400 p-1.5 rounded-lg hover:bg-white/5 transition-all disabled:opacity-50"
              title="Ordenar e integrar al dashboard"
            >
              {isProcessing ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            </button>
          )}
          <button
            onClick={() => onDelete(note.id)}
            className="text-gray-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-white/5 transition-all"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}
