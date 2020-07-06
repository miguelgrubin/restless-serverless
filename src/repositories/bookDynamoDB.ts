import { BookRepository, BookList } from './book'
import { Book } from '../entities/book'
import AWS from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { v4 as uuidv4 } from 'uuid'

const TABLE_NAME = process.env.DYNAMODB_BOOKS_TABLE

export class BookDynamoDB implements BookRepository {
  dynamo : DocumentClient
  constructor () {
    this.dynamo = new AWS.DynamoDB.DocumentClient()
  }

  search (filters: any): Promise<BookList> {
    throw new Error('Method not implemented.')
  }

  async fetch (id: string): Promise<Book> {
    return await this.dynamo.get({
      TableName: TABLE_NAME,
      Key: {
        id: id
      }
    }).promise().then((data) => {
      return new Book(data)
    }).catch((err) => {
      console.error(err)
      return null
    })
  }

  async create (book: Book): Promise<Book> {
    book.id = uuidv4()
    const createdBook = await this.dynamo.put({
      TableName: TABLE_NAME,
      Item: book
    }).promise().then((data) => {
      return new Book(data)
    }).catch((err) => {
      console.error(err)
      return null
    })
    return createdBook
  }

  async update (id : string, book: Book): Promise<Book> {
    const data = await this.dynamo.update({
      TableName: TABLE_NAME,
      Key: {
        id: id
      },
      UpdateExpression: 'set author = :a, title = :t, year = :y, isbn = :i',
      ExpressionAttributeValues: {
        ':a': book.author,
        ':t': book.title,
        ':y': book.year,
        ':i': book.isbn
      }
    }).promise()
    return new Book(data)
  }

  async delete (id: string): Promise<boolean> {
    let response = false
    await this.dynamo.delete({
      TableName: TABLE_NAME,
      Key: {
        id: id
      }
    }).promise().then(() => { response = true })
    return response
  }
}
