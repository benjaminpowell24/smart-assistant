import express from 'express'
import { conversation } from '../controllers/conversation.js'
const Router = express.Router()

Router.post('/', async (req, res) => {
  const { messages } = req.body
  if (!Array.isArray(messages)) throw new Error('Messages must be an array.')

  try {
    const response = await conversation(messages)
    res.status(200).send(response)
  } catch (err) {
    console.error('Error:', err)
    res.status(500).send('An unexpected error has occured.')
  }
})

export default Router
