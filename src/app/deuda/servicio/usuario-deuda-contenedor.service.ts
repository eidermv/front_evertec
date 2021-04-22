import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Usuario } from "../modelo/usuario";
import { Deuda } from "../modelo/deuda";

@Injectable({
  providedIn: 'root'
})
export class UsuarioDeudaContenedorService {

  public usuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject([]);

  public deudas: BehaviorSubject<Deuda[]> = new BehaviorSubject([]);

  constructor() { }
}
