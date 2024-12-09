import axios, { HttpStatusCode } from 'axios'
import { DictError } from '@/app/api/errors/dict-error'
import { IBaiduDict } from '@/types/dict'

interface IGetBaiduDictResponse {
  result: {
    from: string
    trans_result: {
      dict: string
      dst: string
      src_tts: string
      dst_tts: string
      src: string
    }[]
    to: string
  }
  log_id: string
}

export class DictController {
  static async getDict(q: string) {
    return await this.getBaiduDict(q)
  }

  private static async getBaiduDict(q: string) {
    try {
      const word = q.trim()
      const accessTokenResponse = await axios.post<{ access_token: string }>(
        `https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=${process.env.BAIDU_AK}&client_secret=${process.env.BAIDU_SK}`
      )

      if (!accessTokenResponse.data.access_token) {
        throw new DictError(
          'Failed to get access token',
          'ACCESS_TOKEN_ERROR',
          HttpStatusCode.InternalServerError
        )
      }

      const response = await axios.post<IGetBaiduDictResponse>(
        `https://aip.baidubce.com/rpc/2.0/mt/texttrans-with-dict/v1?access_token=${accessTokenResponse.data.access_token}&from=en&to=zh&q=${word}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          data: {
            from: 'en',
            to: 'zh',
            q: word
          }
        }
      )

      const dicts = response.data.result.trans_result.map((item) => ({
        ...item,
        dict: JSON.parse(item.dict) as IBaiduDict
      }))

      return dicts[0]
    } catch (_) {
      return null
    }
  }
}
