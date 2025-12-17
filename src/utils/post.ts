import axios from 'axios'

export async function postSequential(
  url: string,
  dataList: any[],
) {
  for (let i = 0; i < dataList.length; i++) {
    const data = dataList[i]

    await axios.post(url, data)

    console.log(`✔ [${i + 1}/${dataList.length}] posted`)
  }
}
