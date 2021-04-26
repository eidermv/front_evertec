import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Usuario } from "../../modelo/usuario";
import { Opciones, OpcionSelect, TablaColumna } from "../../../app/modelo/tabla";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ReplaySubject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UsuarioDeudaService } from "../../servicio/usuario-deuda.service";
import { UsuarioDeudaContenedorService } from "../../servicio/usuario-deuda-contenedor.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ExcelService } from "../../servicio/excel.service";
import { takeUntil } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import Swal from "sweetalert2";
import { ExcelJson, ExportExcel } from "../../modelo/export";
import { Deuda } from "../../modelo/deuda";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from "moment";

@Component({
  selector: 'app-consultar-deuda',
  templateUrl: './consultar-deuda.component.html',
  styleUrls: ['./consultar-deuda.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ConsultarDeudaComponent implements OnInit, OnDestroy {

  private usuario: Usuario;

  public columnas: TablaColumna[] = [
    { label: 'Identificación', propiedad: 'identificacion', tipo: 'fixInitT', visible: true, cssClasses: [] },
    { label: 'Nombre', propiedad: 'nombre', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Correo', propiedad: 'correo', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Id', propiedad: 'id_deuda', tipo: 'text', visible: false, cssClasses: [] },
    { label: 'Monto', propiedad: 'monto', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Fecha Vencimiento', propiedad: 'fecha_vencimiento', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Opciones', propiedad: 'option', tipo: 'option', visible: true, cssClasses: [] }
  ];
  public opciones: Opciones[] = [
    {opcion: 1, icon: 'edit', texto: 'Editar'},
    {opcion: 2, icon: 'visibility', texto: 'Ver'},
    {opcion: 3, icon: 'delete', texto: 'Eliminar'}
  ];
  public itemsPagina: number[] = [5, 10, 20];
  public tamanoH = 'mediana';
  public filtro = false;

  public dataSource: MatTableDataSource<any> = new MatTableDataSource([]);
  private subs: ReplaySubject<void> = new ReplaySubject();

  public mostrarPaginacion = true;

  @ViewChild('matTable') table: MatTable<any>;

  private paginacion: MatPaginator;
  private ordenar: any;
  public tamano = 'table-container';

  @ViewChild(MatPaginator) set matPaginator(mypaginator: MatPaginator) {
    this.paginacion = mypaginator;
    this.cargarAtributos();
  }

  @ViewChild(MatSort) set content(content: ElementRef) {
    this.ordenar = content;
    if (this.ordenar) {
      this.dataSource.sort = this.ordenar;
    }
  }


  public controls = {
    ident: new FormControl('', [Validators.required]),
    monto: new FormControl('', [Validators.required]),
    fecha_carga: new FormControl('', [Validators.required])

  };

  public deudaForm: FormGroup;

  public inicioFecha: Date = new Date(2020,12, 31);
  public limiteFecha: Date = new Date(2100,12, 31);

  constructor(
    private fb: FormBuilder,
    private usuarioService: UsuarioDeudaService,
    private contenedor: UsuarioDeudaContenedorService,
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private excelService: ExcelService
  ) {
    console.log('--- constructor de listar');
  }

  ngOnInit(): void {

    this.deudaForm = this.fb.group({
      ident: this.controls.ident,
      monto: this.controls.monto,
      fecha_carga: this.controls.fecha_carga
    });
    //this.usuarioService.listarDeudas(this.usuario);

    this.contenedor.consultas.asObservable().pipe(takeUntil(this.subs)).subscribe((consultas) => {
      this.cargarDatos(consultas);
    });
  }


  guardar(): void {
    let timerInterval;
    let tiempo = 1500;
    //if (this.deudaForm.valid) {
      if (this.controls.ident.value === '' && this.controls.monto.value === '' && this.controls.fecha_carga.value === '') {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Por favor, agregue un parametro para filtrar informacion',
          showConfirmButton: false,
          timer: 1500
        });
      } else {
        const deuda = {
          identificacion: this.controls.ident.value,
          monto: this.controls.monto.value,
          fecha_carga: moment(this.controls.fecha_carga.value).format('YYYY-MM-DD'),
        };

        console.log(moment(this.controls.fecha_carga.value).format('YYYY-MM-DD'));

        Swal.fire({
          title: 'Consultando!',
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

        this.usuarioService.listarDeudasFiltro(deuda);
      }

    //}
  }




  cargarAtributos(): void {
    this.dataSource.paginator = this.paginacion;
    this.dataSource.sort = this.ordenar;
  }

  cargarDatos(valores: any[]): void {
    this.dataSource.data = valores;
    this.filtro = true;

    if (valores.length > 5) {
      this.mostrarPaginacion = true;
    }
    // this.table.renderRows();
  }

  filtrar(event: Event): void {
    const filtroValor = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filtroValor.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  opcion(i: number, data: any, valor?: MatSlideToggleChange): void {
    const opcionClick: any = new OpcionSelect();
    opcionClick.opcion = i;
    opcionClick.dato = data;
    if (i === -1) {
      opcionClick.check = valor.checked;
      // console.log('valor de swtch ' + valor.checked);
    }
    switch (i) {
      case 1:
        let deuda: Deuda = new Deuda();
        deuda.id_deuda = data.id_deuda;
        deuda.monto = data.monto;
        deuda.fecha_vencimiento = data.fecha_vencimiento;
        let usua: Usuario = new Usuario();
        usua.identificacion = data.identificacion;
        usua.nombre = data.identificacion;
        usua.correo = data.correo;
        this.router.navigateByUrl('/usuario/editar_deuda/' + JSON.stringify(usua) + '/' + JSON.stringify(deuda));
        break;
      case 2:
        Swal.fire({
          title: 'Deuda',
          html:
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Identificacion</div> </div> <input type="text" class="form-control" id="swal-input1" placeholder="Identificacion" disabled value="' + data.identificacion + '"> </div>' +
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Nombre</div> </div> <input type="text" class="form-control" id="swal-input2" placeholder="Nombre" disabled value="' + data.nombre + '"> </div>' +
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Correo</div> </div> <input type="text" class="form-control" id="swal-input3" placeholder="Correo" disabled value="' + data.correo + '"> </div>' +
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Id deuda</div> </div> <input type="text" class="form-control" id="swal-input4" placeholder="Id Deuda" disabled value="' + data.id_deuda + '"> </div>' +
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Monto</div> </div> <input type="text" class="form-control" id="swal-input5" placeholder="Monto" disabled value="' + data.monto + '"> </div>' +
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Fecha Vencimiento</div> </div> <input type="text" class="form-control" id="swal-input6" placeholder="Fech Vencimiento" disabled value="' + data.fecha_vencimiento + '"> </div>',
          focusConfirm: false,
        });
        break;
      case 3:
        Swal.fire({
          title: 'Estas seguro?',
          text: 'Deseas eliminar la deuda ' + data.id_deuda + ' ' + data.monto,
          icon: 'warning',
          showClass: {
            popup: 'animate__animated animate__fadeInDown'
          },
          hideClass: {
            popup: 'animate__animated animate__fadeOutUp'
          },
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, eliminar!'
        }).then((result) => {
          if (result.isConfirmed) {
            this.usuarioService.eliminarDeuda(data).subscribe(
              (resp: any) => {
                if (resp.error === '0') {
                  Swal.fire(
                    'Eliminado!',
                    'Deuda se ha eliminado con exito.',
                    'success'
                  );
                  this.contenedor.consultas.next(this.contenedor.consultas.value.filter((deuda) => deuda.id_deuda !== data.id_deuda));
                  // this.cargarDatos(this.contenedor.deudas.value);
                } else {
                  Swal.fire(
                    'Fallo!',
                    'Deuda no se ha eliminado.',
                    'error'
                  );
                }
              },
              () => {
                Swal.fire(
                  'Fallo!',
                  'Deuda no se ha eliminado.',
                  'error'
                );
              },
              () => {}
            );
          }
        });
        break;
    }
    // this.opcionSel.emit(opcionClick);
    // console.error(' ----- selecciono una opcion');
  }

  trackByProperty<T>(index: number, column): any {
    return column.propiedad;
  }

  trackByOpcion<T>(index: number, opt): any {
    return opt.opcion;
  }

  calcularW(label: string, propiedad: string): string {
    let cal = 0;

    const labels = label.split(' ');
    let mayor = 0;
    labels.forEach((valor) => {
      const t = valor.length;
      mayor = mayor < t ? t : mayor;
    });

    cal = mayor * 12;
    if (label === 'Ips'){
      cal = 180;
    }


    return cal + 'px';
  }

  trackByIndex(_: number, data: any): number {
    const col = this.columnas.find(item => item.propiedad.toLocaleUpperCase().includes('ID'));
    return data[col?.propiedad];
  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

  get visibleColumns(): string[] {
    return this.columnas.filter(column => column.visible).map(column => column.propiedad);
  }

  irCrear(): void {
    this.router.navigateByUrl('/usuario/crear_deuda/' + JSON.stringify(this.usuario));
  }

  descargar() {

    if (!this.dataSource.filteredData[0]){
      Swal.fire(
        'Fallo!',
        'No se puede descargar, No hay datos.',
        'error'
      );
    } else {
      const udt: ExcelJson = {
        data: [
          { A: 'Identificacion', B: 'Nombre', C: 'Correo', D: 'Id_Deuda', E: 'Monto', F: 'Fecha_Vencimiento' }, // table header
        ],
        skipHeader: true
      };
      this.dataSource.filteredData.forEach(item => {
        udt.data.push({
          A: item.identificacion,
          B: item.nombre,
          C: item.correo,
          D: item.id_deuda,
          E: item.monto,
          F: item.fecha_vencimiento
        });
      });

      this.excelService.exportAsExcel(udt, 'Deudas_filtradas');
    }
  }
}
