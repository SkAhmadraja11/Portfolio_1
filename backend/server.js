import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'
import contactRoutes from './routes/contactRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

app.use(helmet())
app.use(morgan('dev'))
app.use(cors({ origin: true }))
app.use(express.json({ limit: '1mb' }))

// routes
app.use(contactRoutes)

// error handler
app.use((err, req, res, next)=>{
  console.error(err)
  res.status(500).json({ message: 'Server error.' })
})

async function start(){
  try{
    if(process.env.MONGO_URI){
      await mongoose.connect(process.env.MONGO_URI)
      console.log('MongoDB connected')
    }else{
      console.warn('MONGO_URI not set — skipping DB connection')
    }
    app.listen(PORT, ()=>console.log(`Server listening on ${PORT}`))
  }catch(err){
    console.error('Failed to start server', err)
    process.exit(1)
  }
}

start()
