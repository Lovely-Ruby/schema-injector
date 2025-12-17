import 'dotenv/config'

import { CustomerCreateSchema } from '../schema/customer.schema'
import { generateMock } from '../mock/generate'
import { postSequential } from '../utils/post-sequential'

process.env.INJECT_RUN_ID ||= Date.now().toString()

console.log('🚀 Inject run at', process.env.INJECT_RUN_ID)

console.log(
  'CRM_TOKEN exists:',
  Boolean(process.env.CRM_TOKEN),
)

async function main() {
  const args = process.argv.slice(2)

  const getArg = (key: string) =>
    args.find(a => a.startsWith(`--${key}=`))?.split('=')[1]

  const url =
    getArg('url') ??
    'https://crm.foremost.develop.kiyoung.cn/api/v1/customers'

  const count = Number(getArg('count') || 1)
  const dryRun = args.includes('--dry')

  const dataList = generateMock(
    CustomerCreateSchema,
    count,
  )

  if (dryRun) {
    console.log('🧪 DRY RUN（不会写数据库）')
    console.table(dataList)
    return
  }

  console.log(`🚀 Posting to ${url}`)
  await postSequential(url, dataList)
  console.log('✅ All customers inserted')
}

main().catch(err => {
  console.error('❌ Inject failed')
  console.error(err)
  process.exit(1)
})
