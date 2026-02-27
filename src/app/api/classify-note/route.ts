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
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 800,
        messages: [{
          role: 'user',
          content: `Sos un asistente inteligente para el dashboard de Tramicar (plataforma de transferencias vehiculares en Argentina).

Un miembro del equipo escribió esta nota rápida. Tu trabajo es:
1. Clasificar en qué sección del dashboard va
2. Corregir errores de ortografía y redacción
3. Darle un título profesional y claro
4. Escribir una descripción limpia y expandida
5. Dar una sugerencia útil sobre la idea/nota

CATEGORÍAS:
- idea: una idea, propuesta, feature, mejora
- traba: un problema, bloqueo, algo que frena el avance
- riesgo: algo que podría salir mal, peligro potencial
- recurso: un link, documento, herramienta, referencia
- decision: algo que se decidió o definió

Respondé SOLO con JSON válido, sin markdown, sin backticks, sin explicación extra:
{
  "category": "idea|traba|riesgo|recurso|decision",
  "title": "título profesional y claro (máx 80 chars)",
  "description": "descripción limpia, corregida y expandida de la nota original",
  "priority": "alta|media|baja",
  "suggestion": "sugerencia concreta de la IA sobre esta nota (próximo paso, consideración, o mejora)",
  "summary": "frase corta de lo que se hizo: ej 'Idea clasificada como nueva propuesta de escalamiento'"
}

NOTA DEL USUARIO: "${content.replace(/"/g, '\\"')}"`
        }],
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Anthropic error:', err)
      return NextResponse.json({ error: 'Anthropic API error' }, { status: 500 })
    }

    const data = await res.json()
    const text = data.content?.[0]?.text || ''
    
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'Could not parse response' }, { status: 500 })
    }

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (e: any) {
    console.error('classify-note error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
