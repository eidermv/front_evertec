import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Opciones, OpcionSelect, TablaColumna } from "../../../app/modelo/tabla";
import Swal from 'sweetalert2';
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ReplaySubject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UsuarioDeudaService } from "../../servicio/usuario-deuda.service";
import { ActivatedRoute, Router } from "@angular/router";
import { UsuarioDeudaContenedorService } from "../../servicio/usuario-deuda-contenedor.service";
import { take, takeUntil } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { Usuario } from "../../modelo/usuario";
import { ExcelService } from "../../servicio/excel.service";
import { ExcelJson, ExportExcel } from "../../modelo/export";


@Component({
  selector: 'app-listar-deudas',
  templateUrl: './listar-deudas.component.html',
  styleUrls: ['./listar-deudas.component.css']
})
export class ListarDeudasComponent implements OnInit, OnDestroy {

  private usuario: Usuario;

  public columnas: TablaColumna[] = [
    { label: 'Id', propiedad: 'id_deuda', tipo: 'fixInitT', visible: true, cssClasses: [] },
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

  constructor(
    private usuarioService: UsuarioDeudaService,
    private contenedor: UsuarioDeudaContenedorService,
    private router: Router,
    private rutaActiva: ActivatedRoute,
    private excelService: ExcelService
  ) {
    console.log('--- constructor de listar');
  }

  ngOnInit(): void {
    this.rutaActiva.params.pipe(take(1)).subscribe((params) => {
      this.usuario = JSON.parse(params.usuario);
      this.usuarioService.listarDeudas(this.usuario);
    });
    this.contenedor.deudas.asObservable().pipe(takeUntil(this.subs)).subscribe((deudas) => {
      this.cargarDatos(deudas);
    });
  }

  cargarAtributos(): void {
    this.dataSource.paginator = this.paginacion;
    this.dataSource.sort = this.ordenar;
  }

  cargarDatos(valores: any[]): void {
    this.dataSource.data = valores;
    if (valores.length > 5) {
      this.mostrarPaginacion = true;
      this.filtro = true;
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
        this.router.navigateByUrl('/usuario/editar_deuda/' + JSON.stringify(this.usuario) + '/' + JSON.stringify(data));
        break;
      case 2:
        Swal.fire({
          title: 'Deuda',
          html:
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Id deuda</div> </div> <input type="text" class="form-control" id="swal-input1" placeholder="Id Deuda" disabled value="' + data.id_deuda + '"> </div>' +
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Monto</div> </div> <input type="text" class="form-control" id="swal-input2" placeholder="Monto" disabled value="' + data.monto + '"> </div>' +
            '<div class="input-group mb-2"> <div class="input-group-prepend"> <div class="input-group-text">Fecha Vencimiento</div> </div> <input type="text" class="form-control" id="swal-input3" placeholder="Fech Vencimiento" disabled value="' + data.fecha_vencimiento + '"> </div>',
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
                  this.contenedor.deudas.next(this.contenedor.deudas.value.filter((deuda) => deuda.id_deuda !== data.id_deuda));
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

  volver(): void{
    this.router.navigateByUrl('/usuario/listar_usuario');
  }

  descargar() {
    let dataExp: ExportExcel[] = [];
    let dato: ExportExcel;
    this.dataSource.filteredData.forEach((item) => {
      dato = new ExportExcel();
      dato.identificacion = this.usuario.identificacion;
      dato.nombre = this.usuario.nombre;
      dato.correo = this.usuario.correo;
      dato.id_deuda = item.id_deuda;
      dato.monto = item.monto;
      dato.fecha_vencimiento = item.fecha_vencimiento;
      dataExp.push(dato);
    });

    const udt: ExcelJson = {
      data: [
        { A: 'Identificacion', B: 'Nombre', C: 'Correo', D: 'Id_Deuda', E: 'Monto', F: 'Fecha_Vencimiento' }, // table header
      ],
      skipHeader: true
    };
    this.dataSource.filteredData.forEach(item => {
      udt.data.push({
        A: this.usuario.identificacion,
        B: this.usuario.nombre,
        C: this.usuario.correo,
        D: item.id_deuda,
        E: item.monto,
        F: item.fecha_vencimiento
      });
    });

    this.excelService.exportAsExcel(udt, 'Deudas_'+this.usuario.identificacion);
  }
}
