export default class BusinessException extends Error {
  status: number = 500

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}