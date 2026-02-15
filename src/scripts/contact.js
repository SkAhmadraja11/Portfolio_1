export async function sendContact(data){
  const backend = (window && window.__BACKEND_URL) ? window.__BACKEND_URL : ''
  const url = backend ? `${backend}/api/contact` : '/api/contact'
  const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
  if(!res.ok){
    const err = await res.json().catch(()=>({message:'Network error'}))
    throw new Error(err.message || 'Failed')
  }
  return res.json()
}
