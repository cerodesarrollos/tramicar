import { NextRequest, NextResponse } from 'next/server'

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY

export async function POST(req: NextRequest) {
  if (!ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
  }

  const { content, userId } = await req.json()
  if (!content) {
    return NextResponse.json({ error: 'No content' }, { status: 400 })
  }

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Sos un clasificador de notas para el dashboard de Tramicar (plataforma de transferencias vehiculares en Argentina).

Clasificá esta nota en UNA de estas categorías:
- idea: una idea, propuesta, feature, mejora
- traba: un problema, bloqueo, algo que frena el avance
- riesgo: algo que podría salir mal, peligro potencial
- recurso: un link, documento, herramienta, referencia
- decision: algo que se decidió o definió
- reunion: notas de una reunión o encuentro

Respondé SOLO con JSON válido, sin markdown ni explicación:
{
  "category": "idea|traba|riesgo|recurso|decision|reunion",
  "title": "título corto y claro (máx 80 chars)",
  "description": "descripción limpia de la nota",
  "priority": "alta|media|baja",
  "summary": "resumen de 1 línea de lo que se hizo con la nota"
}

NOTA: "${content}"`
        }],
      }),
    })

    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    
    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse response' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
