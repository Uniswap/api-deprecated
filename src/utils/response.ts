import { APIGatewayProxyResult } from 'aws-lambda'

export function createResponse(statusCode: number, body: any): APIGatewayProxyResult {
  return {
    body: JSON.stringify(body),
    statusCode,
    headers: {
      'content-type': 'application/json'
    }
  }
}

export function createSuccessResponse(body: any): APIGatewayProxyResult {
  return createResponse(200, body)
}

export function createErrorResponse(code: number, message: string): APIGatewayProxyResult {
  return createResponse(code, { errorCode: code, message })
}

export function createBadRequestResponse(message: string = 'Bad request'): APIGatewayProxyResult {
  return createErrorResponse(400, message)
}

export function createServerErrorResponse(error: Error): APIGatewayProxyResult {
  return createErrorResponse(500, error.message)
}
