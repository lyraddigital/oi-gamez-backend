export class RestCommandError extends Error {
  constructor(public statusCode?: number, public errorPayload?: any) {
    super();
  }
}
