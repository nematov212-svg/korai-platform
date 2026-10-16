export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  constructor(statusCode: number, message: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  static badRequest(message: string, details?: any) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message: string = 'Autentifikatsiyadan o‘tish talab qilinadi') {
    return new ApiError(401, message);
  }

  static forbidden(message: string = 'Bu amalni bajarish uchun ruxsat yo‘q') {
    return new ApiError(403, message);
  }

  static notFound(message: string = 'Resurs topilmadi') {
    return new ApiError(404, message);
  }

  static tooManyRequests(message: string = 'So‘rovlar soni oshib ketdi. Iltimos, birozdan keyin urinib ko‘ring') {
    return new ApiError(429, message);
  }

  static internal(message: string = 'Serverda ichki xatolik yuz berdi') {
    return new ApiError(500, message);
  }
}
