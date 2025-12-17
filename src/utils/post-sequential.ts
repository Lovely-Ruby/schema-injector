import { http } from './http'

export async function postSequential(
  url: string,
  dataList: any[],
  method: 'post' | 'put' | 'patch' = 'post',
) {
  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i]

    await http[method](url, data)

    console.log(`✔ [${i + 1}/${dataList.length}] ${method.toUpperCase()}`)
  }
}
