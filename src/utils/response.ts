import { APIGatewayProxyResult } from 'aws-lambda'

export function createResponse(statusCode: number, body: any, { maxAge }: { maxAge: number }): APIGatewayProxyResult {
  return {
    body: JSON.stringify(body),
    statusCode,
    headers: {
      'content-type': 'application/json',
      'cache-control': `max-age=0, s-maxage=${maxAge}`
    }
  }
}

export function createSuccessResponse(body: any, maxAge: number): APIGatewayProxyResult {
  return createResponse(200, body, { maxAge })
}

export function createErrorResponse(code: number, message: string): APIGatewayProxyResult {
  return createResponse(code, { errorCode: code, message }, { maxAge: 0 })
}

export function createBadRequestResponse(message: string = 'Bad request'): APIGatewayProxyResult {
  return createErrorResponse(400, message)
}

export function createServerErrorResponse(error: Error): APIGatewayProxyResult {
  return createErrorResponse(500, error.message)
}
