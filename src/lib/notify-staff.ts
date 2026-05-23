export interface NotifyField {
  label: string
  value: string
}

export async function notifyStaff(
  formName: string,
  fields: NotifyField[],
): Promise<void> {
  const res = await fetch('/api/public/notify-staff', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      formName,
      fields: fields.filter((f) => f.value && f.value.trim().length > 0),
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`notify-staff failed: ${res.status} ${body}`)
  }
}
