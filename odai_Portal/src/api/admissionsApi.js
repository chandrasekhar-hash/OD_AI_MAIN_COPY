// API Client for OD AI HUB Portal Admissions & Enquiries
// Connects to the backend (Port 8003 by default, with fallbacks to 8001/8002)

const BACKEND_URLS = [
  'http://localhost:8003/api/v1',
  'http://localhost:8001/api/v1',
  'http://localhost:8002/api/v1',
  '/api/v1'
];

export async function submitAdmissionEnquiry(payload) {
  const data = {
    name: payload.name.trim(),
    phone: payload.phone.trim(),
    email: payload.email?.trim() || null,
    class_or_degree: payload.qualification ? `${payload.qualification}${payload.examMode ? ` | Mode: ${payload.examMode}` : ''}` : null,
    course_name: payload.program || 'OD AI Admissions Track',
    year: payload.intake || '2026-2027',
    stream_name: payload.examMode || 'ODAT',
    message: [
      `[Source: OD AI Portal]`,
      `[Program: ${payload.program || 'B.Tech CS & AI'}]`,
      `[Exam Mode: ${payload.examMode || 'Online Proctored'}]`,
      `[Intake: ${payload.intake || 'January 2027'}]`,
      `[Qualification: ${payload.qualification || 'Not Specified'}]`,
      payload.notes ? `\nNotes / Questions: ${payload.notes.trim()}` : ''
    ].filter(Boolean).join(' ')
  };

  let lastError = null;

  // Try ports in priority order (8003 -> 8001 -> 8002)
  for (const baseUrl of BACKEND_URLS) {
    try {
      const response = await fetch(`${baseUrl}/enquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        return { success: true, data: result, endpoint: baseUrl };
      } else {
        const errJson = await response.json().catch(() => ({}));
        lastError = new Error(errJson.detail || `Server responded with ${response.status}`);
      }
    } catch (err) {
      lastError = err;
      // Continue to fallback backend URL
    }
  }

  throw lastError || new Error('Could not reach admission backend. Please ensure the backend is running.');
}

