import { HttpInterceptorFn } from "@angular/common/http";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({ url: `https://reqres.in/api${req.url}` });
  return next(apiReq);
};
