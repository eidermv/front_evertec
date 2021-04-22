import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SesionService } from "./sesion.service";
import { environment } from "../../../environments/environment";

@Injectable()
export class PeticionInterceptor implements HttpInterceptor {

  constructor(private sesionService: SesionService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    let auth = this.sesionService.getLocalAuthKey();
    console.log('-->'+auth);
    if (!auth.includes(environment.origin)) {
      auth = "Bearer " + auth;
    } else {
      auth = auth.replace(environment.origin, 'Basic');
    }
    if (!auth) {
      return next.handle(request);
    }
    const headers = request.clone({
      headers: request.headers.set('Content-Type', 'application/json').set('Authorization', auth)
    });
    return next.handle(headers);
  }
}
