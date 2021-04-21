import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalService } from "./local.service";
import { Login } from "../../login/modelo/login";
import { environment } from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private authKey: string;
  public logueado: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private localService: LocalService) {
  }

  public setLocalAuthKey(mode: string, key: string = ""): void {
    this.authKey = mode + " " + key;
    this.localService.setJsonValue("authKey", this.authKey);
  }

  public getLocalAuthKey(): string {
    return this.localService.getJsonValue("authKey");
  }

  public guardarDatos(login: Login) {
    this.localService.setJsonValue('usuario', login);
  }
}
