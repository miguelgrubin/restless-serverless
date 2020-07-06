import { Book } from '../entities/book'
export type BookList = Array<Book>

export interface BookRepository {
  search(filters): Promise<BookList>;
  fetch(id: string): Promise<Book>;
  create(book: Book): Promise<Book>;
  update(id: string, book: Book): Promise<Book>;
  delete(id: string): Promise<boolean>;
}
