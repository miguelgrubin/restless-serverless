import { BookRepository } from '../repositories/book'
import { Book } from '../entities/book'
import { BaseService, Response, ErrorResponse, SuccessResponse } from './index'

export class BookService extends BaseService {
  repository: BookRepository;

  constructor (repository: BookRepository) {
    super()
    this.repository = repository
  }

  async create (book: Book) : Promise<Response> {
    if (book.isValid()) {
      const bookData = await this.repository.create(book)
      return new SuccessResponse({ data: bookData })
    }
    return new ErrorResponse({
      error: 'Bad Request',
      message: 'Invalid  book',
      deailts: book.getValidationErrors()
    }, '400')
  }

  async update (id: string, book: Book) : Promise<Response> {
    if (!this.repository.fetch(id)) {
      return new ErrorResponse({
        error: 'Not found',
        message: 'Book not found with id: ' + id
      }, '404')
    }
    if (book.isValid()) {
      const bookData = await this.repository.update(id, book)
      return new SuccessResponse({ data: bookData })
    }
    return new ErrorResponse({
      error: 'Bad Request',
      message: 'Invalid book',
      deailts: book.getValidationErrors()
    }, '400')
  }

  async show (id: string) : Promise<Response> {
    const bookData = await this.repository.fetch(id)
    if (bookData) {
      return new SuccessResponse({ data: bookData })
    }
    return new ErrorResponse({
      error: 'Not found',
      message: `Book not found with id: ${id}`
    }, '404')
  }

  async delete (id: string) : Promise<Response> {
    if (this.repository.delete(id)) {
      return new SuccessResponse({ data: 'Book deleted' })
    }
    return new ErrorResponse({
      error: 'Not found',
      message: `Book not found with id: ${id}`
    }, '404')
  }

  async search (filters: unknown) : Promise<Response> {
    const bookList = await this.repository.search(filters)
    return new SuccessResponse({ data: bookList })
  }
}
