'use client'
import { useEffect, useState } from 'react'
import { getActivities } from '../../store'
import { TEAM_USERS } from '../../data'
import type { Activity } from '../../data'
import { Activity as ActivityIcon } from 'lucide-react'

export default function ActividadPage() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); getActivities().then(setActivities) }, [])
  if (!mounted) return null

  // Group by date
  const grouped: Record<string, Activity[]> = {}
  activities.forEach(a => {
    const date = new Date(a.timestamp).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(a)
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white flex items-center gap-2">
          <ActivityIcon size={22} className="text-indigo-400" /> Actividad
        </h1>
        <p className="text-gray-400 text-sm mt-1">Timeline de todo lo que pasa en el equipo</p>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[15px] top-0 bottom-0 w-px bg-white/10" />

        <div className="space-y-8">
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <div className="relative flex items-center gap-3 mb-4">
                <div className="w-[31px] h-[31px] bg-[#0d0d18] border-2 border-indigo-500/30 rounded-full flex items-center justify-center z-10">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                </div>
                <h3 className="text-xs font-medium text-indigo-300 uppercase tracking-wider">{date}</h3>
              </div>

              <div className="ml-[31px] pl-6 space-y-3">
                {items.map(a => {
                  const u = TEAM_USERS.find(u => u.id === a.user)
                  const time = new Date(a.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
                  return (
                    <div key={a.id} className="flex items-start gap-3 group">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0" style={{ background: `${u?.color || '#666'}15` }}>
                        {u?.avatar || '?'}
                      </div>
                      <div className="flex-1 bg-white/[0.02] rounded-xl px-3.5 py-2.5 group-hover:bg-white/[0.04] transition-colors">
                        <p className="text-xs text-gray-300">
                          <span className="font-medium text-white">{u?.name}</span>{' '}
                          <span className="text-gray-400">{a.action}</span>{' '}
                          <span className="text-indigo-300">{a.target}</span>
                        </p>
                        <p className="text-[10px] text-gray-600 mt-0.5">{time}</p>
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
        <div className="text-center py-12">
          <p className="text-gray-500 text-sm">Sin actividad registrada todavía</p>
        </div>
      )}
    </div>
  )
}
