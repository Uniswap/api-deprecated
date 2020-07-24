import { getAddress } from '@ethersproject/address'
import { APIGatewayProxyHandler } from 'aws-lambda'

import { createSuccessResponse, createServerErrorResponse } from '../utils/response'
import { getTopPairs } from './_shared'

interface ReturnShape {
  [tokenIds: string]: { last_price: string; base_volume: string; quote_volume: string }
}

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const pairs = await getTopPairs()

    return createSuccessResponse(
      pairs.reduce<ReturnShape>((accumulator, pair): any => {
        const id0 = getAddress(pair.token0.id)
        const id1 = getAddress(pair.token1.id)
        accumulator[`${id0}_${id1}`] = {
          last_price: pair.price ?? '0',
          base_volume: pair.volumeToken0,
          quote_volume: pair.volumeToken1
        }
        return accumulator
      }, {})
    )
  } catch (error) {
    return createServerErrorResponse(error)
  }
}
