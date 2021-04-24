import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LocalService } from "./local.service";
import { Login } from "../../login/modelo/login";
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SesionService {

  private authKey: string;
  public logueado: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private localService: LocalService,
    private httpClient: HttpClient
  ) {
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

  public getDatos() {
    return this.localService.getJsonValue('usuario');
  }

  public refreshAuth() {
    let headers = new HttpHeaders({
      'Authorization': 'Bearer 1',
    });
    let options = { headers: headers };
    return this.httpClient.put(environment.apiUrl+'usuario/refreshAuth', null, options);
  }
}
