export class ApplicationError extends Error {
  constructor(
    public tag: string,
    public message: string,
    protected code: number = 400
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
