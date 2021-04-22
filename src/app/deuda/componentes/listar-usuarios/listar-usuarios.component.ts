import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Opciones, OpcionSelect, TablaColumna } from "../../../app/modelo/tabla";
import { MatTable, MatTableDataSource } from "@angular/material/table";
import { ReplaySubject } from "rxjs";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { UsuarioDeudaService } from "../../servicio/usuario-deuda.service";
import { Router } from "@angular/router";
import { UsuarioDeudaContenedorService } from "../../servicio/usuario-deuda-contenedor.service";
import { take, takeUntil } from "rxjs/operators";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";

@Component({
  selector: 'app-listar-usuarios',
  templateUrl: './listar-usuarios.component.html',
  styleUrls: ['./listar-usuarios.component.css']
})
export class ListarUsuariosComponent implements OnInit, OnDestroy {

  public columnas: TablaColumna[] = [
    { label: 'Identificación', propiedad: 'identificacion', tipo: 'fixInitT', visible: true, cssClasses: [] },
    { label: 'Nombre', propiedad: 'nombre', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Correo', propiedad: 'correo', tipo: 'text', visible: true, cssClasses: [] },
    { label: 'Opciones', propiedad: 'option', tipo: 'option', visible: true, cssClasses: [] }
  ];
  public opciones: Opciones[] = [
    {opcion: 1, icon: 'visibility', texto: 'Ver Deudas'}
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
    private router: Router
  ) {
    console.log('--- constructor de listar');
  }

  ngOnInit(): void {
    this.usuarioService.listarUsuarios();
    this.contenedor.usuarios.asObservable().pipe(takeUntil(this.subs)).subscribe((usuarios) => {
      this.cargarDatos(usuarios);
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
        this.router.navigateByUrl('/usuario/listar_deuda/' + JSON.stringify(data));
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
}
