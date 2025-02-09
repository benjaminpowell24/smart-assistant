import 'dotenv/config'
import express from 'express'
import conversation from './routes/conversation.js'
import cors from 'cors'
import { CONFIG } from './utils/config.js'

import { logger } from './logger.js'

const port = CONFIG.PORT || 3000

const server = express()
const baseURI = '/v1/smart-assistant'

server.use(express.json())
server.use(express.urlencoded({ extended: false }))
server.use(cors())

server.use(`${baseURI}/conversation`, conversation)

  try {
      server.listen(port, () => {
        logger.info(
            `Server listening on localhost: ${port}`
        )
      })
  } catch (e) {
    logger.error('Error starting application', e)
  }
