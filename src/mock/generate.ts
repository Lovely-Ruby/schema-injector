import type { z } from 'zod'
import { generateMock as zodMock } from '@anatine/zod-mock'
import { faker } from '@faker-js/faker'

export interface MockOptions {
  seed?: number
  backupMocks?: Record<string, () => any>
}

export function generateMock<T extends z.ZodTypeAny>(
  schema: T,
  count: number,
  options: MockOptions = {},
): z.infer<T>[] {
  const {
    seed = Math.floor(Math.random() * 1000000),
    backupMocks = {},
  } = options

  // 默认的 backupMocks，处理 literal 和 union 类型
  const defaultBackupMocks = {
    ZodLiteral: () => {
      // 为 literal 类型提供默认值
      const literals = [318, 317, 316, 315, 1405, 1404, 186, 184]
      return literals[Math.floor(Math.random() * literals.length)]
    },
    ZodUnion: (schema: any) => {
      // 处理 union 类型，从选项中随机选择
      const options = schema.options || []
      if (options.length > 0) {
        const option = options[Math.floor(Math.random() * options.length)]
        return option._def.value !== undefined
          ? option._def.value
          : faker.datatype.number({ min: 100, max: 2000 })
      }
      return faker.datatype.number({ min: 100, max: 2000 })
    },
    ZodNumber: () => faker.datatype.number({ min: 1, max: 1000 }),
    ZodString: () => faker.lorem.words(3),
    ZodArray: (schema: any) => {
      const minLength = schema._def.minLength?.value || 1
      const maxLength = schema._def.maxLength?.value || 3
      const length = faker.datatype.number({ min: minLength, max: maxLength })
      return Array.from({ length }, () => ({}))
    },
  }

  const finalBackupMocks = { ...defaultBackupMocks, ...backupMocks }

  return Array.from({ length: count }).map((_, index) => {
    const result = zodMock(schema, {
      seed: seed + index,
      faker,
      backupMocks: finalBackupMocks,
    })

    return result
  })
}

export function generateSingleMock<T extends z.ZodTypeAny>(
  schema: T,
  options: MockOptions = {},
): z.infer<T> {
  return generateMock(schema, 1, options)[0]
}

export function generateMockWithCallback<T extends z.ZodTypeAny>(
  schema: T,
  count: number,
  callback: (item: z.infer<T>, index: number) => void,
  options: MockOptions = {},
): z.infer<T>[] {
  const items = generateMock(schema, count, options)
  items.forEach(callback)
  return items
}

export function generateMockToFile<T extends z.ZodTypeAny>(
  schema: T,
  count: number,
  filePath: string,
  options: MockOptions = {},
): z.infer<T>[] {
  const items = generateMock(schema, count, options)

  if (typeof window === 'undefined') {
    const fs = require('node:fs')
    fs.writeFileSync(filePath, JSON.stringify(items, null, 2))
  }

  return items
}

// 专门为 OrderCreateSchema 定制的生成函数
export function generateOrderMock(count: number) {
  const customerIds = [318, 317, 316, 315]
  const ownerIds = [1405, 1404, 186, 184]
  const productSkuIds = [2409, 2408, 2407, 2406]
  return Array.from({ length: count }, () => ({
    customer_id: customerIds[Math.floor(Math.random() * customerIds.length)],
    owner_id: ownerIds[Math.floor(Math.random() * ownerIds.length)],
    items: Array.from({
      length: faker.number.int({ min: 1, max: 5 }),
    }, () => ({
      product_sku_id: productSkuIds[Math.floor(Math.random() * productSkuIds.length)],
      code: faker.string.alphanumeric({ length: 8 }).toUpperCase(),
      title: faker.commerce.productName(),
      quantity: faker.number.int({ min: 1, max: 10 }),
      price: Number.parseFloat(faker.commerce.price({ min: 10, max: 500, dec: 2 })),
    })),
  }))
}
