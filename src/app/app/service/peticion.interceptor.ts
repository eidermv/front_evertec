import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpHeaders, HttpErrorResponse
} from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { SesionService } from "./sesion.service";
import { environment } from "../../../environments/environment";
import { catchError, filter, finalize, switchMap, take, takeUntil } from "rxjs/operators";
import { LocalService } from "./local.service";
import Swal from 'sweetalert2';
import { Router } from "@angular/router";


@Injectable()
export class PeticionInterceptor implements HttpInterceptor {

  private refreshTokenInProgress = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);


  constructor(
    private sesionService: SesionService,
    private localService: LocalService,
    private router: Router
    ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): any {
    let auth = this.cargarToken(request);

    if (!auth) {
      return next.handle(request);
    }
    console.log('-->'+auth);
    const headers = request.clone({
      headers: request.headers.set('Content-Type', 'application/json').set('Authorization', auth)
    });
    // para refresh token -3, "Usuario no autorizado"
    return next.handle(headers).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error && error.status === 401) {
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
          });

          if (error.error.error === -3 && error.error.mensaje === 'Usuario no autorizado') {
            console.log('==============> de token: ');
            return this.sesionService.refreshAuth().pipe(
              take(1),
              switchMap( (resp: any) => {
                if (resp.error.toString() === '0') {
                  Toast.fire({
                    icon: 'success',
                    title: 'Sesion se refresco con exito'
                  });
                  this.sesionService.setLocalAuthKey(resp.key);
                  this.localService.setJsonValue('logueado', 'true');
                  this.sesionService.guardarDatos(resp.data);
                  this.sesionService.logueado.next(true);


                  let auth2 = this.cargarToken(request);

                  const headers2 = request.clone({
                    headers: request.headers.set('Content-Type', 'application/json').set('Authorization', auth2)
                  });
                  // console.log('|||||===---> ENTRA AQUI |||||||');
                  return next.handle(headers2);


                } else {
                  Toast.fire({
                    icon: 'error',
                    title: 'Sesion no se refresco y se cerrara sesion'
                  });
                  this.cerrarSesion();
                }
              })
              );/*.subscribe(
              (resp: any) => {

                if (resp.error.toString() === '0') {
                  Toast.fire({
                    icon: 'success',
                    title: 'Sesion se refresco con exito'
                  });
                  this.sesionService.setLocalAuthKey(resp.key);
                  this.localService.setJsonValue('logueado', 'true');
                  this.sesionService.guardarDatos(resp.data);
                  this.sesionService.logueado.next(true);


                  let auth2 = this.cargarToken(request);

                  const headers2 = request.clone({
                    headers: request.headers.set('Content-Type', 'application/json').set('Authorization', auth2)
                  });
                  // console.log('|||||===---> ENTRA AQUI |||||||');
                  return next.handle(headers2);


                } else {
                  Toast.fire({
                    icon: 'error',
                    title: 'Sesion no se refresco y se cerrara sesion'
                  });
                  this.cerrarSesion();
                }

            },
              error => {
                Toast.fire({
                  icon: 'error',
                  title: 'Sesion no se refresco y se cerrara sesion'
                });
                this.cerrarSesion();
              });*/
          } else {
            Toast.fire({
              icon: 'error',
              title: 'Sesion no se refresco y se cerrara sesion'
            });
            this.cerrarSesion();
          }


        } else {
          return throwError(error);
        }
      })
    );
  }

  private cerrarSesion(){
    this.localService.clearToken();
    this.sesionService.logueado.next(false);
    this.router.navigateByUrl('/usuario/login');
  }

  private cargarToken(request: any) {
    let auth = this.sesionService.getLocalAuthKey();

    if (!auth.includes(environment.origin) && request.headers.get('Authorization') === null) {
      // auth = "Bearer " + auth;
      //if (!this.refreshTokenInProgress) {
      //  auth = "Bearer " + 'eyJvcmlnaW4iOiJFdmVydGVjLXBydWViYSIsImFsZyI6IkhTMjU2In0.eyJqdGkiOiJFVlQtMkIzN0ExM0JBN0VDQjVCOTFFQUE0NEE4N0RDOTNEM0E1OEY3NjcwOCIsImlhdCI6MTYxOTA2NDExOCwic3ViIjoie1wiaWRfbG9naW5cIjpcIjFcIixcImlkZW50aWZpY2FjaW9uXCI6XCIxMjM1XCIsXCJub21icmVcIjpcIlBlZHJpdG8gUGFycmFcIixcImNvcnJlb1wiOlwicGVyZXpAcGVyZXpcIn0iLCJpc3MiOiJFdmVydGVjIEluYyIsImF1ZCI6ImFkbWluIiwiZXhwIjoxNjE5MTE4MTE4fQ.GxVk8iTgQ3dxSiR04N2KYLQB-BhgoHoAHP-Hu4gTf1A';
      //} else {
        auth = "Bearer " + auth;
      //  this.refreshTokenInProgress = false;
      //}
    } else if (request.headers.get('Authorization') === 'Bearer 1') {
      //this.refreshTokenInProgress = true;
      auth = 'Refresh ' + btoa(JSON.stringify(this.sesionService.getDatos()));
    } else {
      auth = auth.replace(environment.origin, 'Basic');
    }

    console.log('|--------=> '+auth);

    return auth;
  }
}
