/* eslint-disable no-magic-numbers */
enum HttpStatusCodes {
  Ok = 200,
  Created,
  Accepted,
  NoContent = 204,
  MovedPermanently = 301,
  Redirect,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
  RequestTimeout = 408,
  ImALittleTeapot = 418,
  InternalServerError = 500,
  NotImplemented,
  BadGateway,
  ServiceUnavailable,
  GatewayTimeout,
}

export default HttpStatusCodes;
