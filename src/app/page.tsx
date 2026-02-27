import Link from 'next/link'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-5 py-4 flex items-center justify-between bg-white/90 backdrop-blur-xl border-b border-border">
        <div className="font-display text-xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-sm text-white">🚗</div>
          <span className="text-text">Trami</span><span className="text-primary">car</span>
        </div>
        <Link href="/auth" className="px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary2 transition-all">
          Empezar
        </Link>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-16 px-5 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-border text-xs text-primary font-medium mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green animate-pulse" />
            Primera plataforma de transferencias en Argentina
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold leading-tight mb-5 text-text">
            Transferí tu auto{' '}
            <span className="text-primary">sin vueltas</span>
          </h1>
          <p className="text-gray text-lg leading-relaxed mb-8">
            Automatizamos todo el proceso: seña segura, informes, verificación policial, turno en el registro y coordinación de pago.
          </p>
          <div className="flex flex-col gap-3 max-w-xs mx-auto">
            <Link href="/auth" className="w-full py-4 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all shadow-lg shadow-primary/20 text-center">
              Empezar ahora →
            </Link>
            <a href="#como" className="w-full py-4 border border-border text-text font-semibold rounded-full hover:border-primary transition-all text-center bg-white">
              ¿Cómo funciona?
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center gap-8 mt-12">
          {[
            { value: '15', unit: 'min', label: 'Iniciar proceso' },
            { value: '0', unit: '', label: 'Filas' },
            { value: '100%', unit: '', label: 'Seguro' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-2xl font-bold">
                <span className="text-primary">{s.value}</span>{s.unit && <span className="text-text"> {s.unit}</span>}
              </div>
              <div className="text-[10px] text-gray uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick categories - miArgentina style */}
      <section className="py-12 px-5">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-lg font-bold text-text mb-6">¿Qué necesitás hacer?</h2>
          <div className="grid grid-cols-4 gap-3">
            {[
              { icon: '🚗', label: 'Transferir' },
              { icon: '📋', label: 'Informes' },
              { icon: '🔍', label: 'Verificar' },
              { icon: '📅', label: 'Turnos' },
              { icon: '💰', label: 'Seña' },
              { icon: '📄', label: 'Documentos' },
              { icon: '🔒', label: 'Seguridad' },
              { icon: '❓', label: 'Ayuda' },
            ].map(c => (
              <div key={c.label} className="flex flex-col items-center gap-2 p-3 bg-white border border-border rounded-xl hover:shadow-md transition-all cursor-pointer">
                <div className="w-10 h-10 bg-primary-light rounded-xl flex items-center justify-center text-lg border border-primary/10">
                  {c.icon}
                </div>
                <span className="text-[11px] font-medium text-text">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problems */}
      <section className="py-12 px-5 bg-surface2" id="problemas">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-2xl font-bold mb-6 text-text">
            Comprar un auto hoy es un <span className="text-red">dolor de cabeza</span>
          </h2>
          <div className="grid gap-3">
            {[
              { icon: '😰', title: 'Miedo a que te caguen', desc: 'Documentos falsos, inhibiciones ocultas, embargos que aparecen después.' },
              { icon: '💸', title: 'Multas sorpresa', desc: 'Pagaste el auto y después te dicen que debe millones en multas.' },
              { icon: '📝', title: 'Papeles infinitos', desc: 'DNRPA, VPA, 08, CETA, patentes... Nadie sabe qué hacer ni en qué orden.' },
              { icon: '⏰', title: 'Tiempo perdido', desc: 'Colas en el registro, turnos imposibles, trámites que se alargan semanas.' },
              { icon: '🚫', title: 'Parálisis', desc: 'Hay gente que NO cambia el auto por miedo al proceso.' },
              { icon: '🤷', title: 'Cero guía', desc: 'Cada uno se arregla como puede. No hay un sistema que te lleve de la mano.' },
            ].map(p => (
              <div key={p.title} className="bg-white border border-border rounded-xl p-4 flex gap-3">
                <span className="text-2xl">{p.icon}</span>
                <div>
                  <h3 className="font-display font-semibold text-sm mb-1 text-text">{p.title}</h3>
                  <p className="text-xs text-gray leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-12 px-5" id="como">
        <div className="max-w-lg mx-auto">
          <h2 className="font-display text-2xl font-bold mb-2 text-text">6 pasos. Todo guiado.</h2>
          <p className="text-gray mb-8">Vos seguís las instrucciones, nosotros nos encargamos del resto.</p>

          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary to-green" />
            <div className="flex flex-col gap-6">
              {[
                { icon: '💰', title: 'Seña segura', tag: 'auto', desc: 'Depósito en escrow. Si hay problemas, se devuelve.' },
                { icon: '📋', title: 'Informes DNRPA', tag: 'vos', desc: 'Verificamos que el auto esté limpio de deudas y embargos.' },
                { icon: '🔍', title: 'Multas y patentes', tag: 'auto', desc: 'Chequeamos deudas pendientes. Sin sorpresas.' },
                { icon: '🔒', title: 'Verificación policial', tag: 'vos', desc: 'Te sacamos turno y completamos los datos automáticamente.' },
                { icon: '📅', title: 'Turno en registro', tag: 'auto', desc: 'Sacamos el turno en el registro seccional.' },
                { icon: '🎉', title: 'Pago + transferencia', tag: 'vos', desc: 'Coordinamos el encuentro y te guiamos hasta la firma.' },
              ].map((s, i) => (
                <div key={i} className="flex gap-4 relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg shrink-0 bg-white border border-border shadow-sm z-10">
                    {s.icon}
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-display font-semibold text-sm text-text">{s.title}</span>
                      <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${s.tag === 'auto' ? 'bg-green-light text-green border border-green/20' : 'bg-amber-light text-amber border border-amber/20'}`}>
                        {s.tag === 'auto' ? 'Automático' : 'Vos'}
                      </span>
                    </div>
                    <p className="text-xs text-gray leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-5 bg-surface2" id="precios">
        <div className="max-w-lg mx-auto text-center">
          <h2 className="font-display text-2xl font-bold mb-8 text-text">Simple y transparente</h2>
          <div className="grid gap-4">
            <div className="bg-white border border-border rounded-2xl p-6 text-left">
              <h3 className="font-display text-lg font-semibold mb-1 text-text">Básico</h3>
              <p className="text-xs text-gray mb-4">Para los que quieren hacer la parte difícil solos</p>
              <div className="font-display text-3xl font-bold text-text mb-1">$15.000 <span className="text-sm text-gray font-normal">/ operación</span></div>
              <ul className="mt-4 space-y-2">
                {['Informes DNRPA', 'Verificación de multas', 'Guía paso a paso', 'Soporte por chat'].map(f => (
                  <li key={f} className="text-sm text-gray flex items-center gap-2">
                    <span className="text-green font-bold">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className="w-full mt-5 py-3 border border-primary text-primary font-semibold rounded-full hover:bg-primary-light transition-all">
                Elegir Básico
              </button>
            </div>
            <div className="bg-white border-2 border-primary rounded-2xl p-6 text-left relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-primary text-white text-[11px] font-bold py-1.5 text-center">
                RECOMENDADO
              </div>
              <div className="mt-4">
                <h3 className="font-display text-lg font-semibold mb-1 text-text">Completo</h3>
                <p className="text-xs text-gray mb-4">Nos encargamos de todo</p>
                <div className="font-display text-3xl font-bold text-text mb-1">$35.000 <span className="text-sm text-gray font-normal">/ operación</span></div>
                <ul className="mt-4 space-y-2">
                  {['Todo lo del plan Básico', 'Seña en escrow seguro', 'Turnos automáticos', 'Verificación policial gestionada', 'Coordinación de pago', 'Soporte prioritario'].map(f => (
                    <li key={f} className="text-sm text-gray flex items-center gap-2">
                      <span className="text-green font-bold">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <button className="w-full mt-5 py-3 bg-primary text-white font-semibold rounded-full hover:bg-primary2 transition-all">
                  Elegir Completo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-5 text-center bg-primary">
        <h2 className="font-display text-3xl font-bold mb-4 text-white">
          ¿Listo para transferir sin vueltas?
        </h2>
        <p className="text-white/70 mb-8">Empezá tu primera operación en menos de 15 minutos.</p>
        <Link href="/auth" className="inline-block px-8 py-4 bg-white text-primary font-semibold rounded-full hover:shadow-lg transition-all">
          Crear cuenta gratis →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 text-center text-xs text-gray bg-white">
        © 2026 Tramicar. Todos los derechos reservados.
      </footer>
    </div>
  )
}
