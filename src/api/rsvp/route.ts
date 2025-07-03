// pages/api/rsvp.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const scriptUrl = process.env.GOOGLE_SHEETS_URL!
  const resp = await fetch(scriptUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req.body),
  })

  const result = await resp.text()
  if (!resp.ok) return res.status(500).json({ ok: false, error: result })

  return res.status(200).json({ ok: true, result: JSON.parse(result) })
}
