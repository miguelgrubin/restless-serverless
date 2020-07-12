/* eslint-env mocha */
import { BookService } from '../../src/services/book'
import { BookDynamoDB } from '../../src/repositories/bookDynamoDB'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { Book } from '../../src/entities/book'
import { HTTP_STATUS } from '../../src/constants'

const VALID_BOOK = new Book({
  author: 'Homero',
  title: 'Ilíada'
})

const INVALID_BOOK = new Book({
  author: 'Ana Rosa'
})

const sandbox = sinon.createSandbox()
describe('BookService', () => {
  let bookService : BookService
  let bookRepositoryStub

  afterEach(() => {
    sandbox.restore()
  })

  beforeEach(() => {
    bookRepositoryStub = sandbox.createStubInstance(BookDynamoDB)
  })

  describe('#create()', () => {
    beforeEach(() => {
      bookRepositoryStub.create.resolves(new Book(VALID_BOOK))
      bookService = new BookService(bookRepositoryStub)
    })
    describe('with valid book payload', async () => {
      it('persists a book', async () => {
        await bookService.create(VALID_BOOK)
        expect(bookRepositoryStub.create.calledWith(VALID_BOOK))
      })
      it('gets a success created message', async () => {
        const result = await bookService.create(VALID_BOOK)
        expect(result.statusCode).to.equal(HTTP_STATUS.created)
      })
    })
    describe('with invalid book payload', async () => {
      it('does not presist a book', async () => {
        await bookService.create(INVALID_BOOK)
        expect(!bookRepositoryStub.create.called)
      })
      it('gets a bad request error', async () => {
        const result = await bookService.create(INVALID_BOOK)
        expect(result.statusCode).to.equal(HTTP_STATUS.badRequest)
      })
    })
  })

  describe('#show()', () => {
    describe('with existing book', () => {
      beforeEach(() => {
        bookRepositoryStub.fetch.resolves(new Book(VALID_BOOK))
        bookService = new BookService(bookRepositoryStub)
      })
      it('fetchs a book from database', async () => {
        const bookId = '123-456-789'
        await bookService.show(bookId)
        expect(bookRepositoryStub.fetch.calledWith(bookId))
      })
      it('gets a success message', async () => {
        const bookId = '123-456-789'
        const result = await bookService.show(bookId)
        expect(result.statusCode).to.equal(HTTP_STATUS.ok)
      })
    })
    describe('with unexisting book', () => {
      beforeEach(() => {
        bookRepositoryStub.fetch.resolves(null)
        bookService = new BookService(bookRepositoryStub)
      })
      it('gets a not found error', async () => {
        const bookId = '789-456-123'
        const result = await bookService.show(bookId)
        expect(result.statusCode).to.equal(HTTP_STATUS.notFound)
      })
    })
  })

  describe('#update()', () => {
    describe('with existing book', () => {
      beforeEach(() => {
        bookRepositoryStub.fetch.resolves(new Book(VALID_BOOK))
        bookRepositoryStub.update.resolves(new Book(VALID_BOOK))
        bookService = new BookService(bookRepositoryStub)
      })
      describe('with valid book payload', () => {
        it('gets a success message', async () => {
          const bookId = '789-456-123'
          const result = await bookService.update(bookId, VALID_BOOK)
          expect(result.statusCode).to.equal(HTTP_STATUS.ok)
        })
      })
      describe('with invalid book payload', () => {
        it('gets a bad request error', async () => {
          const bookId = '789-456-123'
          const result = await bookService.update(bookId, INVALID_BOOK)
          expect(result.statusCode).to.equal(HTTP_STATUS.badRequest)
        })
      })
    })
    describe('with unexisting book', () => {
      beforeEach(() => {
        bookRepositoryStub.fetch.resolves(null)
        bookService = new BookService(bookRepositoryStub)
      })
      it('gets a not found error', async () => {
        const bookId = '789-456-123'
        const result = await bookService.update(bookId, VALID_BOOK)
        expect(result.statusCode).to.equal(HTTP_STATUS.notFound)
      })
    })
  })

  describe('#delete()', () => {
    describe('with existing book', () => {
      describe('with success deletion', () => {
        beforeEach(() => {
          bookRepositoryStub.fetch.resolves(new Book(VALID_BOOK))
          bookRepositoryStub.delete.resolves(true)
          bookService = new BookService(bookRepositoryStub)
        })
        it('get a success message', async () => {
          const bookId = '789-456-123'
          const result = await bookService.delete(bookId)
          expect(result.statusCode).to.equal(HTTP_STATUS.noContent)
        })
      })
      describe('with failed deletion', () => {
        beforeEach(() => {
          bookRepositoryStub.fetch.resolves(new Book(VALID_BOOK))
          bookRepositoryStub.delete.resolves(false)
          bookService = new BookService(bookRepositoryStub)
        })
        it('get an internal server error', async () => {
          const bookId = '789-456-123'
          const result = await bookService.delete(bookId)
          expect(result.statusCode).to.equal(HTTP_STATUS.serverError)
        })
      })
    })
    describe('with unexisting book', () => {
      beforeEach(() => {
        bookRepositoryStub.fetch.resolves(null)
        bookService = new BookService(bookRepositoryStub)
      })
      it('gets a not found error', async () => {
        const bookId = '789-456-123'
        const result = await bookService.delete(bookId)
        expect(result.statusCode).to.equal(HTTP_STATUS.notFound)
      })
    })
  })

  describe('#search()', () => {
    describe('with existing books', () => {
      beforeEach(() => {
        bookRepositoryStub.fetch.resolves([new Book(VALID_BOOK), new Book(VALID_BOOK)])
        bookService = new BookService(bookRepositoryStub)
      })
      it('get a success message', async () => {
        const result = await bookService.search({})
        expect(result.statusCode).to.equal(HTTP_STATUS.ok)
      })
    })
    describe('with empty books', () => {
      beforeEach(() => {
        bookRepositoryStub.fetch.resolves([])
        bookService = new BookService(bookRepositoryStub)
      })
      it('get a success message', async () => {
        const result = await bookService.search({})
        expect(result.statusCode).to.equal(HTTP_STATUS.ok)
      })
    })
  })
})
