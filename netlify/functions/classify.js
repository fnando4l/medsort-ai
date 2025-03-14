const DEPARTMENT_ROUTING = {
  'Lab Results': 'Laboratory',
  'Radiology Report': 'Radiology',
  'Prescription': 'Pharmacy',
  'Referral Letter': 'Referral Coordination',
  'Insurance Claim': 'Billing & Insurance',
  'Discharge Summary': 'Medical Records',
  'Progress Notes': 'Medical Records',
  'Pathology Report': 'Pathology',
  'Consent Form': 'Patient Services',
  'Other': 'General Administration',
}

export const handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) }
  }

  let text, apiKey
  try {
    ;({ text, apiKey } = JSON.parse(event.body || '{}'))
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid request body' }) }
  }

  if (!text?.trim()) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Document text is required' }) }
  }
  if (!apiKey?.trim()) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'API key is required' }) }
  }

  const prompt = `Classify the following medical document. Return ONLY valid JSON — no markdown, no explanation, no code fences.

JSON schema:
{
  "category": "<one of: Lab Results | Radiology Report | Prescription | Referral Letter | Insurance Claim | Discharge Summary | Progress Notes | Pathology Report | Consent Form | Other>",
  "confidence": <integer 0-100>,
  "keyInfo": ["<fact1>", "<fact2>", "<fact3>", "<fact4>", "<fact5>"],
  "summary": "<1-2 sentence summary>"
}

Medical document:
${text.slice(0, 6000)}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      const msg = data.error?.message || `API error ${response.status}`
      return { statusCode: response.status, headers, body: JSON.stringify({ error: msg }) }
    }

    const raw = data.content?.[0]?.text || ''
    let result
    try {
      const clean = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim()
      result = JSON.parse(clean)
    } catch {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Could not parse classification response' }),
      }
    }

    result.department = DEPARTMENT_ROUTING[result.category] || 'General Administration'

    return { statusCode: 200, headers, body: JSON.stringify(result) }
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message || 'Classification failed' }),
    }
  }
}
