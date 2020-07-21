import { BookRepository } from '../repositories/book'
import { Book } from '../entities/book'
import { BaseService, Response, ErrorResponse, SuccessResponse } from './index'
import { HTTP_STATUS } from '../constants'

export class BookService extends BaseService {
  repository: BookRepository;

  constructor (repository: BookRepository) {
    super()
    this.repository = repository
  }

  async create (bookPayload: unknown) : Promise<Response> {
    const book = new Book(bookPayload)
    if (book.isValid()) {
      const createdBook = await this.repository.create(book)
      return new SuccessResponse({ data: createdBook }, HTTP_STATUS.created)
    }
    return new ErrorResponse({
      error: 'Bad Request',
      message: 'Invalid  book',
      details: book.getValidationErrors()
    }, HTTP_STATUS.badRequest)
  }

  async update (id: string, bookPayload: unknown) : Promise<Response> {
    if (await this.repository.fetch(id) == null) {
      return new ErrorResponse({
        error: 'Not found',
        message: `Book not found with id: ${id}`
      }, HTTP_STATUS.notFound)
    }
    const book = new Book(bookPayload)
    if (book.isValid()) {
      const bookData = await this.repository.update(id, book)
      return new SuccessResponse({ data: bookData }, HTTP_STATUS.ok)
    }
    return ErrorResponse.badRequest({
      error: 'Bad Request',
      message: 'Invalid book',
      details: book.getValidationErrors()
    })
  }

  async show (id: string) : Promise<Response> {
    const book = await this.repository.fetch(id)
    if (book) {
      return new SuccessResponse({ data: book }, HTTP_STATUS.ok)
    }
    return new ErrorResponse({
      error: 'Not found',
      message: `Book not found with id: ${id}`
    }, HTTP_STATUS.notFound)
  }

  async delete (id: string) : Promise<Response> {
    if (await this.repository.fetch(id) == null) {
      return new ErrorResponse({
        error: 'Not found',
        message: `Book not found with id: ${id}`
      }, HTTP_STATUS.notFound)
    }
    if (await this.repository.delete(id)) {
      return new SuccessResponse({ data: 'Book deleted' }, HTTP_STATUS.noContent)
    }
    return new ErrorResponse({
      error: 'Internal Server Error',
      message: `Book with id: ${id} could not be deleted`
    }, HTTP_STATUS.serverError)
  }

  async search (filters: unknown) : Promise<Response> {
    const bookList = await this.repository.search(filters)
    return new SuccessResponse({ data: bookList }, HTTP_STATUS.ok)
  }
}
