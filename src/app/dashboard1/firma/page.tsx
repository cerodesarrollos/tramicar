'use client'
import { useState } from 'react'
import Navbar from '@/components/Navbar'
import { ArrowLeft, Camera, Shield, CheckCircle2, Fingerprint, ScanFace, CreditCard, FileCheck, ChevronRight, Lock } from 'lucide-react'
import Link from 'next/link'

export default function FirmaPage() {
  const [step, setStep] = useState(0)
  const [verifying, setVerifying] = useState(false)

  const startVerification = () => {
    setStep(1)
  }

  const simulateStep = () => {
    setVerifying(true)
    setTimeout(() => {
      setVerifying(false)
      setStep(prev => prev + 1)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-bg pb-24">
      {/* Header */}
      <div className="bg-primary px-5 pt-12 pb-6 flex items-center gap-3">
        <Link href="/dashboard1/vender" className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </Link>
        <div>
          <h1 className="font-display text-xl font-bold text-white">Firma digital 08D</h1>
          <p className="text-xs text-white/60">Toyota Corolla XEI 2020 — AB 123 CD</p>
        </div>
      </div>

      <div className="px-5 pt-6 flex flex-col gap-4">

        {step === 0 && (
          <>
            {/* Intro */}
            <div className="bg-primary-light border border-primary/10 rounded-2xl p-5 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Fingerprint size={36} className="text-primary" />
              </div>
              <h2 className="font-display font-bold text-xl text-text mb-2">Firma biométrica</h2>
              <p className="text-sm text-text2">Firmá el formulario 08D sin ir al registro. Verificamos tu identidad con RENAPER en segundos.</p>
            </div>

            {/* Steps preview */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs text-gray font-medium mb-3 uppercase tracking-wider">¿Cómo funciona?</p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <CreditCard size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">1. Foto de tu DNI</p>
                    <p className="text-xs text-gray">Frente y dorso — verificamos los datos</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <ScanFace size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">2. Selfie en vivo</p>
                    <p className="text-xs text-gray">Prueba de vida — comparamos con RENAPER</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <FileCheck size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-text">3. Firma del 08D</p>
                    <p className="text-xs text-gray">Revisás el documento y confirmás</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Who signs */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <p className="text-xs text-gray font-medium mb-3 uppercase tracking-wider">Estado de firmas</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-surface2 rounded-xl">
                  <div className="w-8 h-8 bg-amber-light rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-amber">V</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">Juan Pérez <span className="text-xs text-gray">(vendedor)</span></p>
                  </div>
                  <span className="text-xs text-amber font-medium bg-amber-light px-2 py-1 rounded-lg">Pendiente</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface2 rounded-xl">
                  <div className="w-8 h-8 bg-blue-light rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-blue">C</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">María García <span className="text-xs text-gray">(comprador)</span></p>
                  </div>
                  <span className="text-xs text-gray2 font-medium bg-surface3 px-2 py-1 rounded-lg flex items-center gap-1"><Lock size={10} /> Esperando</span>
                </div>
              </div>
            </div>

            <button onClick={startVerification} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2">
              Comenzar verificación <ChevronRight size={18} />
            </button>

            <p className="text-[10px] text-gray2 text-center">
              🔒 Tus datos biométricos se verifican con RENAPER y no se almacenan
            </p>
          </>
        )}

        {step === 1 && (
          <div className="animate-slide-up flex flex-col gap-4">
            <div className="bg-white border border-border rounded-2xl p-5 text-center">
              <CreditCard size={32} className="text-primary mx-auto mb-3" />
              <h2 className="font-display font-bold text-lg text-text mb-1">Foto del DNI — Frente</h2>
              <p className="text-xs text-gray mb-4">Apoyá el DNI sobre una superficie plana y sacale una foto</p>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 bg-primary-light/30 flex flex-col items-center gap-3">
                <Camera size={40} className="text-primary" />
                <p className="text-sm font-medium text-primary">Tocar para abrir cámara</p>
              </div>
            </div>
            <button onClick={simulateStep} disabled={verifying} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {verifying ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verificando...</> : <>Continuar con dorso <ChevronRight size={18} /></>}
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="animate-slide-up flex flex-col gap-4">
            <div className="bg-white border border-border rounded-2xl p-5 text-center">
              <CreditCard size={32} className="text-primary mx-auto mb-3" />
              <h2 className="font-display font-bold text-lg text-text mb-1">Foto del DNI — Dorso</h2>
              <p className="text-xs text-gray mb-4">Dá vuelta el DNI y sacale otra foto</p>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 bg-primary-light/30 flex flex-col items-center gap-3">
                <Camera size={40} className="text-primary" />
                <p className="text-sm font-medium text-primary">Tocar para abrir cámara</p>
              </div>
            </div>
            <div className="bg-green-light border border-green/20 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green" />
              <span className="text-xs text-green font-medium">Frente del DNI verificado ✓</span>
            </div>
            <button onClick={simulateStep} disabled={verifying} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {verifying ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verificando...</> : <>Continuar con selfie <ChevronRight size={18} /></>}
            </button>
          </div>
        )}

        {step === 3 && (
          <div className="animate-slide-up flex flex-col gap-4">
            <div className="bg-white border border-border rounded-2xl p-5 text-center">
              <ScanFace size={40} className="text-primary mx-auto mb-3" />
              <h2 className="font-display font-bold text-lg text-text mb-1">Selfie en vivo</h2>
              <p className="text-xs text-gray mb-4">Mirá a la cámara frontal. Vamos a verificar que seas vos.</p>
              <div className="border-2 border-dashed border-primary/30 rounded-xl p-12 bg-primary-light/30 flex flex-col items-center gap-3 relative">
                <div className="w-24 h-24 border-4 border-primary rounded-full flex items-center justify-center">
                  <ScanFace size={48} className="text-primary/50" />
                </div>
                <p className="text-sm font-medium text-primary">Tocar para abrir cámara frontal</p>
              </div>
            </div>
            <div className="bg-green-light border border-green/20 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green" />
              <span className="text-xs text-green font-medium">DNI frente y dorso verificados ✓</span>
            </div>
            <button onClick={simulateStep} disabled={verifying} className="w-full py-3.5 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {verifying ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verificando identidad con RENAPER...</> : <>Verificar identidad <ChevronRight size={18} /></>}
            </button>
          </div>
        )}

        {step === 4 && (
          <div className="animate-slide-up flex flex-col gap-4">
            {/* Identity verified */}
            <div className="bg-green-light border border-green/20 rounded-2xl p-5 text-center">
              <Shield size={40} className="text-green mx-auto mb-3" />
              <h2 className="font-display font-bold text-xl text-text mb-1">Identidad verificada</h2>
              <p className="text-sm text-gray">RENAPER confirmó tu identidad</p>
              <div className="mt-3 bg-white rounded-xl p-3 text-left space-y-1.5">
                <div className="flex justify-between text-sm"><span className="text-gray">Nombre</span><span className="font-medium text-text">Juan Carlos Pérez</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray">DNI</span><span className="font-medium text-text">30.123.456</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray">Verificación</span><span className="font-medium text-green">Match 99.7%</span></div>
              </div>
            </div>

            {/* 08D Preview */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-3 mb-4">
                <FileCheck size={24} className="text-primary" />
                <h2 className="font-display font-bold text-text">Formulario 08D</h2>
              </div>
              <div className="bg-surface2 rounded-xl p-4 space-y-2 text-sm">
                <p className="text-xs text-gray uppercase tracking-wider font-medium mb-2">Datos de la transferencia</p>
                <div className="flex justify-between"><span className="text-gray">Dominio</span><span className="font-display font-bold text-text tracking-wider">AB 123 CD</span></div>
                <div className="flex justify-between"><span className="text-gray">Vehículo</span><span className="font-medium text-text">Toyota Corolla XEI 2020</span></div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between"><span className="text-gray">Vendedor</span><span className="font-medium text-text">Juan Carlos Pérez</span></div>
                <div className="flex justify-between"><span className="text-gray">DNI vendedor</span><span className="font-medium text-text">30.123.456</span></div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between"><span className="text-gray">Comprador</span><span className="font-medium text-text">María García</span></div>
                <div className="flex justify-between"><span className="text-gray">DNI comprador</span><span className="font-medium text-text">35.678.901</span></div>
                <div className="border-t border-border my-2" />
                <div className="flex justify-between"><span className="text-gray">Precio declarado</span><span className="font-display font-bold text-text">$18.500.000</span></div>
                <div className="flex justify-between"><span className="text-gray">Registro destino</span><span className="font-medium text-text">San Isidro Nº 2</span></div>
              </div>
            </div>

            <button onClick={simulateStep} disabled={verifying} className="w-full py-4 bg-green text-white font-bold rounded-full hover:bg-green/90 transition-all shadow-md shadow-green/20 flex items-center justify-center gap-2 text-base">
              {verifying ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Firmando...</> : <>✍️ Firmar 08D</>}
            </button>

            <p className="text-[10px] text-gray2 text-center">Al firmar, declarás que los datos son correctos y aceptás la transferencia</p>
          </div>
        )}

        {step === 5 && (
          <div className="animate-slide-up flex flex-col gap-4">
            <div className="bg-green-light border border-green/20 rounded-2xl p-6 text-center">
              <CheckCircle2 size={56} className="text-green mx-auto mb-4" />
              <h2 className="font-display font-bold text-2xl text-text mb-2">¡08D Firmado!</h2>
              <p className="text-sm text-gray">Tu firma digital quedó registrada</p>
            </div>

            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-green-light/50 rounded-xl">
                  <CheckCircle2 size={20} className="text-green" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">Juan Pérez <span className="text-xs text-gray">(vendedor)</span></p>
                  </div>
                  <span className="text-xs text-green font-medium">Firmado ✓</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-amber-light/50 rounded-xl">
                  <div className="w-5 h-5 border-2 border-amber rounded-full animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text">María García <span className="text-xs text-gray">(comprador)</span></p>
                  </div>
                  <span className="text-xs text-amber font-medium">Pendiente</span>
                </div>
              </div>
            </div>

            <div className="bg-primary-light border border-primary/10 rounded-2xl p-4 text-center">
              <p className="text-sm text-primary font-medium">Te avisamos por WhatsApp cuando el comprador firme</p>
            </div>

            <Link href="/dashboard1/vender">
              <button className="w-full py-3.5 border border-border bg-white text-text font-semibold rounded-full hover:border-primary transition-all">
                Volver a mi operación
              </button>
            </Link>
          </div>
        )}
      </div>

      <Navbar />
    </div>
  )
}
