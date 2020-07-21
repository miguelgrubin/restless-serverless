import { BookRepository, BookList } from './book'
import { Book } from '../entities/book'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { v4 as uuidv4 } from 'uuid'

const TABLE_NAME = process.env.DYNAMODB_BOOKS_TABLE

export class BookDynamoDB implements BookRepository {
  dynamo : DocumentClient
  constructor () {
    this.dynamo = new DocumentClient()
  }

  search (filters: unknown): Promise<BookList> {
    console.log(filters)
    throw new Error('Method not implemented.')
  }

  async fetch (id: string): Promise<Book> {
    return await this.dynamo.get({
      TableName: TABLE_NAME,
      Key: {
        id: id
      }
    }).promise().then((data) => {
      console.log('Book fetched: ', JSON.stringify(data))
      return new Book(data.Item)
    }).catch((err) => {
      console.error(err)
      return null
    })
  }

  async create (book: Book): Promise<Book> {
    book.id = uuidv4()
    await this.dynamo.put({
      TableName: TABLE_NAME,
      Item: book
    }).promise().catch((err) => {
      console.error(err)
    })
    return book
  }

  async update (id : string, book: Book): Promise<Book> {
    await this.dynamo.update(
      this.updateQuery(id, book)
    ).promise().catch((err) => {
      console.error(err)
    })
    return await this.fetch(id)
  }

  private updateQuery (id: string, book: Book) {
    const query = {
      TableName: TABLE_NAME,
      Key: {
        id: id
      },
      UpdateExpression: '',
      ExpressionAttributeValues: {}
    }
    const fields = []
    for (const field in book) {
      if (book[field]) {
        query.ExpressionAttributeValues[':' + field] = book[field]
        fields.push(field)
      }
    }
    query.UpdateExpression = 'set ' + fields.map((field) => {
      return `${field} = :${field}`
    }).join(', ')
    return query
  }

  async delete (id: string): Promise<boolean> {
    return await this.dynamo.delete({
      TableName: TABLE_NAME,
      Key: {
        id: id
      }
    }).promise().then(() => {
      return true
    }).catch((err) => {
      console.error(err)
      return false
    })
  }
}
