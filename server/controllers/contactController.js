import Contact from '../models/Contact.js'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { validationResult } from 'express-validator'
import mongoose from 'mongoose'
import { promises as fs } from 'fs'
import path from 'path'

dotenv.config()

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

async function fallbackWrite(entry){
  try{
    const storePath = path.resolve('./contact-submissions.jsonl')
    await fs.appendFile(storePath, JSON.stringify(entry) + '\n', 'utf8')
  }catch(e){
    console.error('Fallback write failed:', e && e.message)
  }
}

export async function handleContact(req, res, next){
  try{
    const errors = validationResult(req)
    if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })

    const { name, email, message } = req.body
    const entry = { name, email, message, createdAt: new Date() }

    // If mongoose is connected, save to DB; otherwise fallback to file
    if(mongoose.connection && mongoose.connection.readyState === 1){
      const doc = new Contact(entry)
      await doc.save()
    }else{
      await fallbackWrite(entry)
    }

    // send notification email (best-effort)
    const mail = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`
    }
    transporter.sendMail(mail).catch(err=>{
      console.warn('Nodemailer warning:', err && err.message)
    })

    res.json({ message: 'Message received. Thank you!' })
  }catch(err){
    next(err)
  }
}
