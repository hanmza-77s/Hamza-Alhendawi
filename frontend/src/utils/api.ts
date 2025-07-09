export async function api<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options)
  if (!res.ok) {
    const errText = await res.text()
    throw new Error(errText || res.statusText)
  }
  return res.json()
}