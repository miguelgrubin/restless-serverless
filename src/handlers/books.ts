import { BookService } from '../services/book'
import { BookDynamoDB } from '../repositories/bookDynamoDB'
import { Handler, APIGatewayEvent } from 'aws-lambda'

const bookSrv = new BookService(new BookDynamoDB())

export const createBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.create(
    JSON.parse(event.body)
  )
}

export const updateBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.update(
    event.queryStringParameters.id,
    JSON.parse(event.body)
  )
}

export const searchBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.search(event.queryStringParameters)
}

export const showBook : Handler = async (event: APIGatewayEvent) => {
  console.log(`Show book: ${event.pathParameters.id}`)
  return await bookSrv.show(event.pathParameters.id)
}

export const deleteBook : Handler = async (event: APIGatewayEvent) => {
  console.log(`Delete book: ${event.pathParameters.id}`)
  return await bookSrv.delete(event.pathParameters.id)
}
