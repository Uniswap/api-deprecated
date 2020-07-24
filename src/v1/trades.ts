import { APIGatewayProxyHandler } from 'aws-lambda'

import { getTrades } from './_shared'
import { createSuccessResponse, createBadRequestResponse, createServerErrorResponse } from '../utils/response'

export const handler: APIGatewayProxyHandler = async event => {
  if (!event.pathParameters?.pair || !/^ETH_0x[0-9a-fA-F]{40}$/.test(event.pathParameters.pair)) {
    return createBadRequestResponse()
  }

  return await getTrades(event.pathParameters.pair.substring(4))
    .then(trades => {
      return createSuccessResponse(
        trades.map((trades): any => ({
          trade_id: trades.id,
          price: trades.price,
          base_volume: trades.ethAmount,
          quote_volume: trades.tokenAmount,
          trade_timestamp: trades.timestamp,
          type: trades.type
        }))
      )
    })
    .catch(error => createServerErrorResponse(error))
}
