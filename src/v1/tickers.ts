import { APIGatewayProxyHandler } from 'aws-lambda'
import { getTopPairsData } from './_shared'
import { createSuccessResponse, createServerErrorResponse } from '../utils/response'

export const handler: APIGatewayProxyHandler = async event => {
  return await getTopPairsData()
    .then(([topPairs, topPairsData]) => {
      return createSuccessResponse(
        topPairs.reduce((accumulator: any, _: any, i): any => {
          const pair = topPairs[i]
          const pairData = topPairsData[i]

          accumulator[`ETH_${pair.exchangeAddress}`] = {
            base_name: 'Ether',
            base_symbol: 'ETH',
            base_id: 'ETH',
            ...(pair.tokenName ? { quote_name: pair.tokenName } : {}),
            ...(pair.tokenSymbol ? { quote_symbol: pair.tokenSymbol } : {}),
            quote_id: pair.exchangeAddress,
            quote_token_address: pair.tokenAddress,
            last_price: pairData.price,
            base_volume: pairData.tradeVolumeEth,
            quote_volume: pairData.tradeVolumeToken
          }

          return accumulator
        }, {}),
        60 * 15 // cache for 15 minutes
      )
    })
    .catch(error => createServerErrorResponse(error))
}
