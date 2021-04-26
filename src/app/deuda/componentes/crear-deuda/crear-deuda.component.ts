import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Validacion } from "../../../login/modelo/validacion";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ReplaySubject } from "rxjs";
import { Usuario } from "../../modelo/usuario";
import { UsuarioDeudaService } from "../../servicio/usuario-deuda.service";
import { UsuarioDeudaContenedorService } from "../../servicio/usuario-deuda-contenedor.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DatePipe } from "@angular/common";
import { take, takeUntil } from "rxjs/operators";
import { Deuda } from "../../modelo/deuda";
import * as moment from "moment";
import Swal from "sweetalert2";

@Component({
  selector: 'app-crear-deuda',
  templateUrl: './crear-deuda.component.html',
  styleUrls: ['./crear-deuda.component.css']
})
export class CrearDeudaComponent implements OnInit, OnDestroy, AfterViewInit {

  public errorId: Validacion[] = [
    {tipo: 'required', msn: 'Id deuda es requerido'}
  ];

  public errorMonto: Validacion[] = [
    {tipo: 'required', msn: 'Monto es requerido'}
  ];

  public errorFechVen: Validacion[] = [
    {tipo: 'required', msn: 'Fecha vencimiento es requerido'}
  ];

  public mnsErrorId = '';
  public mnsErrorMonto = '';
  public mnsErrorFechVen = '';



  public controls = {
    id_deuda: new FormControl('', [Validators.required]),
    monto: new FormControl('', [Validators.required]),
    fecha_venc: new FormControl('', [Validators.required])

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
      fecha_vencimiento: this.controls.fecha_venc
    });


    this.rutaActiva.params.pipe(take(1)).subscribe((params) => {
      this.usuario = JSON.parse(params.usuario);
      console.log(JSON.stringify(this.usuario) +  ' ====== ');
    });
  }


  volver(): void{
    this.router.navigateByUrl('/usuario/listar_deuda/' + JSON.stringify(this.usuario));
  }

  guardar(): void {
    let timerInterval;
    let tiempo = 1500;
    if (this.deudaForm.valid) {
      const deuda = {
        id_deuda: this.controls.id_deuda.value,
        monto: this.controls.monto.value,
        fecha_vencimiento: moment(this.controls.fecha_venc.value).format('YYYY-MM-DD'),
        identificacion: this.usuario.identificacion,
        nombre: this.usuario.nombre,
        correo: this.usuario.correo
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
              title: 'Deuda se ha actualizado con exito',
              showConfirmButton: false,
              timer: 1500
            });
            this.router.navigateByUrl('/usuario/listar_deuda/' + JSON.stringify(this.usuario));
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

  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

}
