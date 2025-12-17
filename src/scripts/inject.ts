import 'dotenv/config'

import { CustomerCreateSchema } from '../schema/customer.schema'
import { generateMock } from '../mock/generate'
import { postSequential } from '../utils/post-sequential'

// ----------------------
// bootstrap
// ----------------------

process.env.INJECT_RUN_ID ||= Date.now().toString()



// ----------------------
// config
// ----------------------

type InjectConfig = {
  url: string
  count: number
  dry: boolean
}

function parseConfig(): InjectConfig {
  const args = process.argv.slice(2)

  const getArg = (key: string) =>
    args.find(a => a.startsWith(`--${key}=`))?.split('=')[1]

  const envUrl = process.env.TARGET_URL
  if (!envUrl) {
    throw new Error('❌ TARGET_URL not defined in .env')
  }

  return {
    url: getArg('url') ?? envUrl,
    count: Number(getArg('count') ?? process.env.INJECT_COUNT ?? 1),
    dry: args.includes('--dry') || process.env.INJECT_DRY === 'true',
  }
}

// ----------------------
// main
// ----------------------

async function main() {
  const config = parseConfig()
  console.log('\n' + '═'.repeat(80))
  console.log('🚀  Inject run at', process.env.INJECT_RUN_ID)
  console.log(`🎯  Target: ${config.url}`)
  console.log(`📦  Count : ${config.count}`)
  console.log(`🧪  Dry   : ${config.dry ? 'Yes' : 'No'}`)
  console.log('═'.repeat(80) + '\n')

  // console.log(
  //   'CRM_TOKEN exists:',
  //   Boolean(process.env.CRM_TOKEN),
  // )

  const dataList = generateMock(
    CustomerCreateSchema,
    config.count,
  )

  if (config.dry) {
    console.log('🧪 DRY RUN（不会写数据库）')
    console.table(dataList)
    return
  }

  // console.log(`🚀 Posting to ${config.url}`)
  await postSequential(config.url, dataList)
  console.log('✅ All customers inserted')
}

main().catch(err => {
  console.error('❌ Inject failed')
  console.error(err)
  process.exit(1)
})
