import { promises as fs } from 'fs'
import path from 'path'

export const prerender = false

export async function POST({ request }){
  try{
    // accept empty or non-JSON bodies gracefully
    let data = null
    try{
      data = await request.json()
    }catch(e){
      const txt = await request.text().catch(()=>'')
      if(txt){
        try{ data = JSON.parse(txt) }catch(e2){ data = null }
      }
    }
    const { name, email, message } = data || {}
    if(!name || !email || !message){
      return new Response(JSON.stringify({ message: 'Please provide name, email and message.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if(!emailRegex.test(email)){
      return new Response(JSON.stringify({ message: 'Invalid email address.' }), { status: 400, headers: { 'Content-Type': 'application/json' } })
    }

    const storePath = path.resolve('./contact-submissions.jsonl')
    const entry = { name, email, message, date: new Date().toISOString() }
    await fs.appendFile(storePath, JSON.stringify(entry) + '\n', 'utf8')

    return new Response(JSON.stringify({ message: 'Message received. Thank you!' }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }catch(err){
    console.error('Contact endpoint error:', err)
    return new Response(JSON.stringify({ message: 'Server error.' }), { status: 500, headers: { 'Content-Type': 'application/json' } })
  }
}
