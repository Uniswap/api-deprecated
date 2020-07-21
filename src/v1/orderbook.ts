import { APIGatewayProxyHandler } from 'aws-lambda'

import { getOrderbook } from './_shared'
import { createSuccessResponse, createBadRequestResponse, createServerErrorResponse } from '../utils/response'

export const handler: APIGatewayProxyHandler = async event => {
  if (!event.pathParameters?.pair || !/^ETH_0x[0-9a-fA-F]{40}$/.test(event.pathParameters.pair)) {
    return createBadRequestResponse()
  }

  return await getOrderbook(event.pathParameters.pair.substring(4))
    .then(orderbook => {
      return createSuccessResponse(
        {
          timestamp: orderbook.timestamp,
          bids: orderbook.bids,
          asks: orderbook.asks
        },
        60 * 15 // cache for 15 minutes
      )
    })
    .catch(error => createServerErrorResponse(error))
}
