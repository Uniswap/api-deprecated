import { getAddress } from '@ethersproject/address'
import { APIGatewayProxyHandler } from 'aws-lambda'

import { getTopPairs, Pair } from './_shared'
import { createSuccessResponse, createServerErrorResponse } from '../utils/response'

interface ReturnShape {
  [tokenAddress: string]: { id: string; name: string; symbol: string; maker_fee: '0'; taker_fee: '0.003' }
}

export const handler: APIGatewayProxyHandler = async () => {
  try {
    const pairs = await getTopPairs()
    const tokens = pairs.reduce<{
      [tokenAddress: string]: { id: string; name: string; symbol: string; maker_fee: '0'; taker_fee: '0.003' }
    }>((memo: ReturnShape, pair: Pair): ReturnShape => {
      for (let token of [pair.token0, pair.token1]) {
        const id = getAddress(token.id)
        if (memo[id]) continue
        memo[id] = {
          id,
          name: token.name,
          symbol: token.symbol,
          maker_fee: '0',
          taker_fee: '0.003'
        }
      }
      return memo
    }, {})
    return createSuccessResponse(tokens)
  } catch (error) {
    return createServerErrorResponse(error)
  }
}
