import { createLogger, transports } from 'winston'
import { format } from 'logform'
const { combine, timestamp, label, metadata, json, errors } = format
import pkg from '../package.json' assert { type: 'json' }
import 'winston-daily-rotate-file'

export const logger = (() => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'testing') {
    return {
      info: console.log,
      warn: console.warn,
      debug: console.debug,
      error: console.error,
    }
  }

  const combinedTransport = new transports.DailyRotateFile({
    filename: `${pkg.name}-combined-%DATE%.log`,
    dirname: `../log/services/${pkg.name}/`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '10m',
    maxFiles: '5d',
    createSymlink: false,
  })

  const errorTransport = new transports.DailyRotateFile({
    filename: `${pkg.name}-error-%DATE%.log`,
    dirname: `../log/services/${pkg.name}/`,
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    level: 'error',
    maxSize: '10m',
    maxFiles: '5d',
    createSymlink: false,
  })

  return createLogger({
    level: 'info',
    format: combine(
      label({ label: pkg.name }),
      errors({ stack: true }),
      timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      metadata(),
      json()
    ),
    transports: [new transports.Console(), combinedTransport, errorTransport],
  })
})()
