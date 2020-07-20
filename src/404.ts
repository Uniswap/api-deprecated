import { APIGatewayProxyHandler } from 'aws-lambda'
import { createErrorResponse } from './utils/response'

export const handler: APIGatewayProxyHandler = async event => {
  return createErrorResponse(404, 'Invalid route')
}
