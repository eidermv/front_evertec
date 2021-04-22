import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UsuarioDeudaContenedorService } from "./usuario-deuda-contenedor.service";
import { take } from "rxjs/operators";
import { Usuario } from "../modelo/usuario";
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UsuarioDeudaService {

  constructor(
    private http: HttpClient,
    private contenedor: UsuarioDeudaContenedorService
  ) { }

  listarUsuarios() {
    let usuarios: Usuario[] = [];
    let paramsIn = new HttpParams().set('value', JSON.stringify(''));
    let value = { params: paramsIn };
    this.http.get(environment.apiUrl+'usuario/listarUsuario', value).pipe(take(1)).subscribe( (data: any) => {
      if (data.error === '0') {
        usuarios = data.data;
      } else {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: data.mensaje,
          showConfirmButton: false,
          timer: 1500
        })
      }
    },
      error => {
        console.log(error);
      },
      () => {
      this.contenedor.usuarios.next(usuarios);
      });
  }
}
