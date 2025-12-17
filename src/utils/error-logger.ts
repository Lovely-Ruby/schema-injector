import fs from 'fs'
import path from 'path'

const LOG_DIR = path.resolve(process.cwd(), 'logs')

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR)
}

let buffer: any[] = []

function getRunId() {
  return process.env.INJECT_RUN_ID || 'unknown-run'
}

export function logInjectError(payload: {
  index: number
  url: string
  request: any
  response?: any
  error: any
}) {
  const RUN_ID = getRunId()

  const LOG_FILE = path.join(
    LOG_DIR,
    `inject-error-${RUN_ID}.json`
  )

  buffer.push({
    time: new Date().toISOString(),
    ...payload,
  })

  fs.writeFileSync(LOG_FILE, JSON.stringify(buffer, null, 2))
}
