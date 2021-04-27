import { AfterViewInit, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Validacion } from "../../../login/modelo/validacion";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject } from "rxjs";
import { Usuario } from "../../modelo/usuario";
import { UsuarioDeudaService } from "../../servicio/usuario-deuda.service";
import { UsuarioDeudaContenedorService } from "../../servicio/usuario-deuda-contenedor.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { take, takeUntil } from "rxjs/operators";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-crear-deuda-usuario',
  templateUrl: './crear-deuda-usuario.component.html',
  styleUrls: ['./crear-deuda-usuario.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CrearDeudaUsuarioComponent implements OnInit, OnDestroy, AfterViewInit {

  public errorId: Validacion[] = [
    {tipo: 'required', msn: 'Id deuda es requerido'},
    {tipo: 'maxlength', msn: 'Id deuda supera longitud'}
  ];

  public errorMonto: Validacion[] = [
    {tipo: 'required', msn: 'Monto es requerido'},
    {tipo: 'maxlength', msn: 'Monto supera longitud'}
  ];

  public errorFechVen: Validacion[] = [
    {tipo: 'required', msn: 'Fecha vencimiento es requerido'}
  ];

  public errorIdent: Validacion[] = [
    {tipo: 'required', msn: 'Identificacion es requerido'},
    {tipo: 'maxlength', msn: 'Identificacion supera longitud'}
  ];

  public errorNombre: Validacion[] = [
    {tipo: 'required', msn: 'Nombre es requerido'},
    {tipo: 'maxlength', msn: 'Nombre supera longitud'}
  ];

  public errorCorreo: Validacion[] = [
    {tipo: 'required', msn: 'Correo es requerido'},
    {tipo: 'email', msn: 'Correo es invalido'},
    {tipo: 'maxlength', msn: 'Correo supera longitud'}
  ];

  public mnsErrorId = '';
  public mnsErrorMonto = '';
  public mnsErrorFechVen = '';
  public mnsErrorIdent = '';
  public mnsErrorNomb = '';
  public mnsErrorCorreo = '';



  public controls = {
    id_deuda: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    monto: new FormControl('', [Validators.required, Validators.maxLength(20)]),
    fecha_venc: new FormControl('', [Validators.required]),
    identificacion: new FormControl('', [Validators.required, Validators.maxLength(15)]),
    nombre: new FormControl('', [Validators.required, Validators.maxLength(60)]),
    correo: new FormControl('', [Validators.required, Validators.email, Validators.maxLength(60)])

  };

  public deudaForm: FormGroup;

  private subs: ReplaySubject<void> = new ReplaySubject();
  public inicioFecha: Date = new Date();
  public limiteFecha: Date = new Date(2100,12, 31);

  private usuario: Usuario;

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioDeudaService,
    private contenedor: UsuarioDeudaContenedorService,
    private router: Router,
    private datePipe: DatePipe,
    private rutaActiva: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.deudaForm = this.fb.group({
      id_deuda: this.controls.id_deuda,
      monto: this.controls.monto,
      fecha_vencimiento: this.controls.fecha_venc,
      identificacion: this.controls.identificacion,
      nombre: this.controls.nombre,
      correo: this.controls.correo
    });


  }


  volver(): void{
    this.router.navigateByUrl('/usuario/consultar_deuda');
  }

  guardar(): void {
    let timerInterval;
    let tiempo = 1500;
    if (this.deudaForm.valid) {
      const deuda = {
        id_deuda: this.controls.id_deuda.value,
        monto: this.controls.monto.value,
        fecha_vencimiento: moment(this.controls.fecha_venc.value).format('YYYY-MM-DD'),
        identificacion: this.controls.identificacion.value,
        nombre: this.controls.nombre.value,
        correo: this.controls.correo.value
      };

      Swal.fire({
        title: 'Guardando!',
        html: 'Por favor espere..........',
        timer: tiempo,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        }
      }).then((result) => {
        /* Read more about handling dismissals below */
        if (result.dismiss === Swal.DismissReason.timer) {

        }
      });

      this.usuarioService.editarUsuario(deuda).subscribe(
        (resp: any) => {
          Swal.close();
          if (resp.error === '0') {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Deuda se ha creo con exito',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigateByUrl('/usuario/consultar_deuda');
          } else {
            Swal.fire({
              position: 'top-end',
              icon: 'error',
              title: resp.mensaje,
              showConfirmButton: false,
              timer: 1500
            });
          }
        },
        (err) => {
          console.log(err);
        },
        () => {
        }
      );
    }
  }

  ngAfterViewInit(): void {
    console.log('entra a after view');
    this.controls.id_deuda.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorId.forEach((error) => {
          if (this.controls.id_deuda.hasError(error.tipo)) {
            this.mnsErrorId = error.msn;
          }
        });
      }
      console.log('entra a validar');
    });
    this.controls.monto.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorMonto.forEach((error) => {
          if (this.controls.monto.hasError(error.tipo)) {
            this.mnsErrorMonto = error.msn;
          }
        });
      }
    });
    this.controls.fecha_venc.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorFechVen.forEach((error) => {
          if (this.controls.fecha_venc.hasError(error.tipo)) {
            this.mnsErrorFechVen = error.msn;
          }
        });
      }
    });
    this.controls.identificacion.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorIdent.forEach((error) => {
          if (this.controls.identificacion.hasError(error.tipo)) {
            this.mnsErrorIdent = error.msn;
          }
        });
      }
    });
    this.controls.nombre.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorNombre.forEach((error) => {
          if (this.controls.nombre.hasError(error.tipo)) {
            this.mnsErrorNomb = error.msn;
          }
        });
      }
    });
    this.controls.correo.statusChanges.pipe(takeUntil(this.subs)).subscribe((valor) => {
      if (valor === 'INVALID') {
        this.errorCorreo.forEach((error) => {
          if (this.controls.correo.hasError(error.tipo)) {
            this.mnsErrorCorreo = error.msn;
          }
        });
      }
    });

  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

}
