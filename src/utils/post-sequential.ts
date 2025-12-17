import { http } from './http'
import { logInjectError } from './error-logger'
import { randomUUID } from 'crypto'


export async function postSequential(
  url: string,
  dataList: any[],
) {
  for (let i = 0; i < dataList.length; i++) {
    const traceId = randomUUID()
    const data = {
      ...dataList[i],
      __traceId: traceId, // 👈 加在这里
    }

    try {
      await http.post(url, data)

      console.log(`✔ success traceId=${traceId}`)
    } catch (err: any) {
      const status = err?.response?.status
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message

        console.log(`❌ failed traceId=${traceId}`)

      logInjectError({
        index: i,
        url,
        request: data,
        response: err?.response?.data,
        error: {
          message: err.message,
          status,
        },
      })
    }
  }
}
