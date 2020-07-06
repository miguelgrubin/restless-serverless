import { Book } from '../entities/book'
import { BookService } from '../service/book'
import { BookDynamoDB } from '../repositories/bookDynamoDB'
import { Handler, APIGatewayEvent } from 'aws-lambda'

const bookSrv = new BookService(new BookDynamoDB())

export const createBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.create(
    new Book().fromJSON(event.body)
  )
}

export const updateBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.update(
    event.queryStringParameters.id,
    new Book().fromJSON(event.body)
  )
}

export const searchBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.search(event.queryStringParameters)
}

export const showBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.show(event.queryStringParameters.id)
}

export const deleteBook : Handler = async (event: APIGatewayEvent) => {
  return await bookSrv.delete(event.queryStringParameters.id)
}
