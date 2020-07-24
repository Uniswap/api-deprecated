import { getAddress } from '@ethersproject/address'
import { APIGatewayProxyHandler } from 'aws-lambda'
import { createSuccessResponse, createServerErrorResponse } from '../utils/response'
import { getTopPairs } from './_shared'

interface ReturnShape {
  [tokenIds: string]: {
    base_name: string
    base_symbol: string
    base_id: string
    quote_name: string
    quote_symbol: string
    quote_id: string
    last_price: string
    base_volume: string
    quote_volume: string
  }
}

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const pairs = await getTopPairs()
    return createSuccessResponse(
      pairs.reduce<ReturnShape>((accumulator, pair): ReturnShape => {
        const id0 = getAddress(pair.token0.id)
        const id1 = getAddress(pair.token1.id)

        accumulator[`${id0}_${id1}`] = {
          base_id: id0,
          base_name: pair.token0.name,
          base_symbol: pair.token0.symbol,
          quote_id: id1,
          quote_name: pair.token1.name,
          quote_symbol: pair.token1.symbol,
          last_price: pair.price ?? '0',
          base_volume: pair.previous24hVolumeToken0.toString(),
          quote_volume: pair.previous24hVolumeToken1.toString()
        }

        return accumulator
      }, {})
    )
  } catch (error) {
    return createServerErrorResponse(error)
  }
}
