import { getAddress } from '@ethersproject/address'
import { APIGatewayProxyHandler } from 'aws-lambda'
import BigNumber from 'bignumber.js'
import { createSuccessResponse, createBadRequestResponse, createServerErrorResponse } from '../utils/response'

import { getReserves } from './_shared'
import { computeBidsAsks } from '../utils/computeBidsAsks'

export const handler: APIGatewayProxyHandler = async event => {
  if (
    !event.queryStringParameters?.pair ||
    !/^0x[0-9a-fA-F]{40}_0x[0-9a-fA-F]{40}$/.test(event.queryStringParameters.pair)
  ) {
    return createBadRequestResponse('Invalid pair identifier: must be of format tokenAddress_tokenAddress')
  }

  const [tokenA, tokenB] = event.queryStringParameters?.pair.split('_')
  let idA: string, idB: string
  try {
    ;[idA, idB] = [getAddress(tokenA), getAddress(tokenB)]
  } catch (error) {
    return createBadRequestResponse('Invalid pair identifier: both addresses must be *checksummed*')
  }

  try {
    const [reservesA, reservesB] = await getReserves(idA, idB)

    const timestamp = new Date().getTime()

    return createSuccessResponse(
      {
        timestamp,
        ...computeBidsAsks(new BigNumber(reservesA), new BigNumber(reservesB))
      },
      60 * 15
    )
  } catch (error) {
    return createServerErrorResponse(error)
  }
}
