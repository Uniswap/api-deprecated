import { APIGatewayProxyHandler } from 'aws-lambda'

import { getTopPairs } from './_shared'
import { createSuccessResponse, createServerErrorResponse } from '../utils/response'

export const handler: APIGatewayProxyHandler = async () => {
  return await getTopPairs()
    .then(topPairs =>
      createSuccessResponse({
        ETH: {
          name: 'Ether',
          symbol: 'ETH',
          id: 'ETH',
          maker_fee: '0',
          taker_fee: '0.003'
        },
        ...topPairs.reduce((accumulator: any, pair): any => {
          accumulator[pair.tokenAddress] = {
            ...(pair.tokenName ? { name: pair.tokenName } : {}),
            ...(pair.tokenSymbol ? { symbol: pair.tokenSymbol } : {}),
            id: pair.exchangeAddress,
            maker_fee: '0',
            taker_fee: '0.003'
          }
          return accumulator
        }, {})
      })
    )
    .catch(error => createServerErrorResponse(error))
}
