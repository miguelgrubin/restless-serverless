export class Book {
  id: string;
  author: string;
  title: string;
  year: string;
  isbn: string;

  constructor (args?: unknown) {
    if (args) {
      this.dataMapper(args)
    }
  }

  fromJSON (data: string): Book {
    const dataObj = JSON.parse(data)
    this.dataMapper(dataObj)
    return this
  }

  private dataMapper (data: unknown) : void {
    this.id = data.id
    this.author = data.author
    this.title = data.title
    this.year = data.year
    this.isbn = data.isbn
  }

  toJSON (): string {
    return JSON.stringify(this)
  }

  isValid () : boolean {
    return true
  }

  getValidationErrors () : Array<Error> {
    return [new Error('Dummy error')]
  }
}
