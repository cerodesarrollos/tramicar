'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Share2, MessageCircle, Copy, CheckCircle2, Link as LinkIcon, QrCode, FileText, Camera, ClipboardCheck, Bell, Upload } from 'lucide-react'
import Link from 'next/link'

export default function InvitarPage() {
  const [copied, setCopied] = useState(false)
  const inviteLink = 'https://tramicar.app/op/abc123'

  const handleCopy = () => {
    navigator.clipboard?.writeText(inviteLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWhatsApp = () => {
    const text = `¡Hola! Te invito a completar la transferencia del Toyota Corolla XEI 2020 (AB 123 CD) por Tramicar. Ingresá acá: ${inviteLink}`
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
        <Link href="/dashboard1/vender/diagnostico" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Invitar comprador</h1>
          <p className="text-xs text-white/60">Toyota Corolla XEI 2020 — AB 123 CD</p>
        </div>
      </div>

      {/* Progress */}
      <div className="px-5 py-4">
        <div className="flex gap-2">
          <div className="flex-1 h-1.5 rounded-full bg-primary" />
          <div className="flex-1 h-1.5 rounded-full bg-primary" />
          <div className="flex-1 h-1.5 rounded-full bg-primary" />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[10px] text-primary font-medium">Vehículo ✓</span>
          <span className="text-[10px] text-primary font-medium">Diagnóstico ✓</span>
          <span className="text-[10px] text-primary font-medium">Invitar</span>
        </div>
      </div>

      <div className="px-5 flex flex-col gap-4">
        {/* Vehicle summary */}
        <Link href="/dashboard1/informes">
          <div className="bg-green-light border border-green/20 rounded-2xl p-4 flex items-center gap-3 hover:border-green/40 transition-all cursor-pointer">
            <CheckCircle2 size={24} className="text-green shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-text">Vehículo verificado</p>
              <p className="text-xs text-gray">Toyota Corolla XEI 2020 — Listo para transferir</p>
            </div>
            <span className="text-xs text-green font-medium">Ver informes →</span>
          </div>
        </Link>

        {/* Invite options */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-primary-light border border-primary/10 rounded-xl flex items-center justify-center">
              <Share2 size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-text">Compartí el link</h2>
              <p className="text-xs text-gray">El comprador entra y completa sus datos</p>
            </div>
          </div>

          {/* Link display */}
          <div className="bg-surface2 rounded-xl p-3 flex items-center gap-2 mb-4">
            <LinkIcon size={14} className="text-gray2 shrink-0" />
            <span className="text-xs text-text2 truncate flex-1 font-mono">{inviteLink}</span>
            <button
              onClick={handleCopy}
              className="shrink-0 px-3 py-1.5 bg-white border border-border rounded-lg text-xs font-medium text-text hover:border-primary transition-all flex items-center gap-1"
            >
              {copied ? <><CheckCircle2 size={12} className="text-green" /> Copiado</> : <><Copy size={12} /> Copiar</>}
            </button>
          </div>

          {/* WhatsApp button */}
          <button
            onClick={handleWhatsApp}
            className="w-full py-3.5 bg-[#25D366] text-white font-semibold rounded-full flex items-center justify-center gap-2 hover:bg-[#20BD5A] transition-all shadow-md shadow-[#25D366]/20"
          >
            <MessageCircle size={20} />
            Enviar por WhatsApp
          </button>
        </div>

        {/* Alternative */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-surface2 rounded-xl flex items-center justify-center">
              <QrCode size={20} className="text-text2" />
            </div>
            <div>
              <h2 className="font-display font-semibold text-text">O que cargue la patente</h2>
              <p className="text-xs text-gray">El comprador también puede buscar el auto por patente desde la app</p>
            </div>
          </div>
          <div className="bg-surface2 rounded-xl p-4 text-center">
            <p className="font-display text-2xl font-bold tracking-widest text-primary">AB 123 CD</p>
            <p className="text-xs text-gray mt-1">Decile al comprador que ingrese esta patente</p>
          </div>
        </div>

        {/* Waiting state */}
        <div className="bg-primary-light border border-primary/10 rounded-2xl p-4 text-center">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-semibold text-primary">Esperando al comprador...</p>
          <p className="text-xs text-text2 mt-1">
            <Bell size={12} className="inline mr-1" />
            Te avisamos por WhatsApp cuando el comprador complete su parte
          </p>
        </div>

        {/* Documentation checklist */}
        <div className="bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-light border border-amber/10 rounded-xl flex items-center justify-center">
                <ClipboardCheck size={20} className="text-amber" />
              </div>
              <div>
                <h2 className="font-display font-semibold text-text">Tu documentación</h2>
                <p className="text-xs text-gray">Mientras esperás, andá preparando</p>
              </div>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light px-2.5 py-1 rounded-full">2/5</span>
          </div>

          <div className="space-y-3">
            {/* Done items */}
            <div className="flex items-center gap-3 p-3 bg-green-light/50 rounded-xl">
              <CheckCircle2 size={20} className="text-green shrink-0" />
              <span className="text-sm text-text font-medium">Vehículo identificado</span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-light/50 rounded-xl">
              <CheckCircle2 size={20} className="text-green shrink-0" />
              <span className="text-sm text-text font-medium">Pre-diagnóstico aprobado</span>
            </div>

            {/* Pending items */}
            <button className="w-full flex items-center gap-3 p-3 bg-surface2 rounded-xl hover:bg-surface3 transition-all text-left group">
              <div className="w-5 h-5 rounded-full border-2 border-amber shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-text font-medium">Título del auto</span>
                <p className="text-[10px] text-gray">Foto del título o subí el PDF digital</p>
              </div>
              <Upload size={16} className="text-gray2 group-hover:text-primary transition-colors" />
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-surface2 rounded-xl hover:bg-surface3 transition-all text-left group">
              <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-text font-medium">Cédula verde</span>
                <p className="text-[10px] text-gray">Foto frente y dorso</p>
              </div>
              <Camera size={16} className="text-gray2 group-hover:text-primary transition-colors" />
            </button>

            <button className="w-full flex items-center gap-3 p-3 bg-surface2 rounded-xl hover:bg-surface3 transition-all text-left group">
              <div className="w-5 h-5 rounded-full border-2 border-border shrink-0" />
              <div className="flex-1">
                <span className="text-sm text-text font-medium">Verificación policial</span>
                <p className="text-[10px] text-gray">Subí el comprobante cuando lo tengas</p>
              </div>
              <FileText size={16} className="text-gray2 group-hover:text-primary transition-colors" />
            </button>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  )
}
