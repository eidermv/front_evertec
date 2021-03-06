import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { UsuarioDeudaContenedorService } from "./usuario-deuda-contenedor.service";
import { take, tap } from "rxjs/operators";
import { Usuario } from "../modelo/usuario";
import Swal from 'sweetalert2';
import { Deuda } from "../modelo/deuda";
import { Consulta } from "../modelo/consulta";

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

  eliminarDeuda(data: any) {
    let paramsIn = new HttpParams().set('value', JSON.stringify(data));
    let value = { params: paramsIn };
    return this.http.delete(environment.apiUrl+'usuario/eliminarDeuda', value).pipe(take(1));
  }

  listarDeudas(usuario: Usuario) {
    let deudas: Deuda[] = [];
    let paramsIn = new HttpParams().set('value', JSON.stringify(usuario));
    let value = { params: paramsIn };
    this.http.get(environment.apiUrl+'usuario/listarDeudas', value).pipe(take(1)).subscribe( (data: any) => {
        if (data.error === '0') {
          deudas = data.data;
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
        this.contenedor.deudas.next(deudas);
      });
  }

  listarDeudasFiltro(usuario: any) {
    let consultas: Consulta[] = [];
    let paramsIn = new HttpParams().set('value', JSON.stringify(usuario));
    let value = { params: paramsIn };
    this.http.get(environment.apiUrl+'usuario/consultarDeudas', value).pipe(take(1)).subscribe( (data: any) => {
        if (data.error === '0') {
          consultas = data.data;
        } else {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: data.mensaje,
            showConfirmButton: false,
            timer: 1500
          });
        }
      },
      error => {
        console.log(error);
      },
      () => {
        this.contenedor.consultas.next(consultas);
      });
  }

  editarUsuario(deuda: any) {
    //let paramsIn = new HttpParams().set('value', JSON.stringify(deuda));
    //let value = { params: paramsIn };
    return this.http.post(environment.apiUrl+'usuario/agregarActUsDe', deuda).pipe(take(1));
  }

  crearDeuda(deuda: any) {
    //let paramsIn = new HttpParams().set('value', JSON.stringify(deuda));
    //let value = { params: paramsIn };
    return this.http.post(environment.apiUrl+'usuario/agregarActUsDe', deuda).pipe(take(1)).subscribe( (data: any) => {
        this.contenedor.resultadoInsert.pipe(tap( (rtas) => {
          const ind = rtas.findIndex( (valor) => valor.identificacion === deuda.identificacion && valor.id_deuda === deuda.id_deuda);
          rtas[ind].mensaje = data.mensaje;
          rtas[ind].error = data.error;
        }), take(1)).subscribe();
      }
    );
  }
}
