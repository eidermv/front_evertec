import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Usuario } from "../modelo/usuario";
import { Deuda } from "../modelo/deuda";
import { Consulta } from "../modelo/consulta";

@Injectable({
  providedIn: 'root'
})
export class UsuarioDeudaContenedorService {

  public usuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject([]);

  public deudas: BehaviorSubject<Deuda[]> = new BehaviorSubject([]);

  public consultas: BehaviorSubject<Consulta[]> = new BehaviorSubject([]);

  constructor() { }
}
