import { Component, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from "rxjs/operators";
import { SesionService } from "../service/sesion.service";
import { Router } from "@angular/router";
import { ReplaySubject } from "rxjs";
import { LocalService } from "../service/local.service";
import { Login } from "../../login/modelo/login";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'front-deuda';

  private subs: ReplaySubject<void> = new ReplaySubject();
  public logueado = false;
  public datos: Login;

  constructor(
    private router: Router,
    private sesion: SesionService,
    private localService: LocalService
  ) {
    try {
      let auth = this.sesion.getLocalAuthKey();
      if (auth === null) {
        this.sesion.setLocalAuthKey("Public");
        this.localService.setJsonValue('logueado', 'false');
      }
    }
    catch {
      this.sesion.setLocalAuthKey("Public");
      this.localService.setJsonValue('logueado', 'false');
    }
  }

  iniciarSesion(): void {
    this.router.navigateByUrl('/usuario/login');
  }

  cerrarSesion(): void {
    this.localService.clearToken();
    this.sesion.logueado.next(false);
    this.router.navigateByUrl('/usuario/login');
    /*this.router.navigateByUrl('/usuario/listar', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/usuario/login']);
    });*/
  }

  ngOnInit(): void {
    this.valorSesion();
    this.sesion.logueado.asObservable().pipe(takeUntil(this.subs)).subscribe((valor) => {
      console.log('cambio de valor sesion ' + valor);
      this.logueado = valor;
      if (valor) {
        this.datos = this.sesion.getDatos();
      } else {
        this.datos = new Login();
      }
    });
  }

  valorSesion(): void {
    switch (this.localService.getJsonValue('logueado')) {
      case 'true':
        this.sesion.logueado.next(true);
        this.localService.setJsonValue('logueado', 'true');
        break;
      case 'false':
        this.sesion.logueado.next(false);
        this.localService.setJsonValue('logueado', 'false');
        break;
      default:
        this.sesion.logueado.next(false);
        this.localService.setJsonValue('logueado', 'false');
        break;
    }
  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

  irUsuarios() {
    this.router.navigateByUrl('/usuario/listar_usuario');
  }

  irConsultar() {
    this.router.navigateByUrl('/usuario/consultar_deuda');
  }

  irCargar() {
    this.router.navigateByUrl('/usuario/cargar_archivo');
  }

}
