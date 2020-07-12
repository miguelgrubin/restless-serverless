const AUTHOR_MAX_CHAR = 60

export class Book {
  id: string;
  author: string;
  title: string;
  year: string;
  isbn: string;
  private validationErrors : Array<Error>

  constructor (args?: unknown) {
    this.validationErrors = []
    if (args) {
      this.dataMapper(args)
    }
  }

  private dataMapper (data: any) : void {
    this.id = data.id
    this.author = data.author
    this.title = data.title
    this.year = data.year
    this.isbn = data.isbn
  }

  isValid () : boolean {
    return this.validateAuthor() && this.validateTitle()
  }

  validateAuthor () : boolean {
    if (this.author && this.author.length > AUTHOR_MAX_CHAR) {
      this.validationErrors.push(
        new Error(`Author field cant be greater than ${AUTHOR_MAX_CHAR}`)
      )
      return false
    }
    return true
  }

  validateTitle () : boolean {
    if (!this.title) {
      this.validationErrors.push(
        new Error('Title field must be present')
      )
      return false
    }
    return true
  }

  getValidationErrors () : Array<Error> {
    return this.validationErrors
  }
}
