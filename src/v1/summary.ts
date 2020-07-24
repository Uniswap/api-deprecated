import { APIGatewayProxyHandler } from 'aws-lambda'

import { getTopPairsData } from './_shared'
import { createSuccessResponse, createServerErrorResponse } from '../utils/response'

export const handler: APIGatewayProxyHandler = async () => {
  return await getTopPairsData()
    .then(([topPairs, topPairsData]) => {
      return createSuccessResponse(
        topPairs.reduce((accumulator: any, _: any, i): any => {
          const pair = topPairs[i]
          const pairData = topPairsData[i]

          accumulator[`ETH_${pair.exchangeAddress}`] = {
            last_price: pairData.price,
            base_volume: pairData.tradeVolumeEth,
            quote_volume: pairData.tradeVolumeToken
          }
          return accumulator
        }, {})
      )
    })
    .catch(error => createServerErrorResponse(error))
}
