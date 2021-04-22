import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs";
import { Usuario } from "../modelo/usuario";

@Injectable({
  providedIn: 'root'
})
export class UsuarioDeudaContenedorService {

  public usuarios: BehaviorSubject<Usuario[]> = new BehaviorSubject([]);

  constructor() { }
}
