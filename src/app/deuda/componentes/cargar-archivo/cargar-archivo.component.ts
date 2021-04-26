import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ErrorArchivo } from "../../modelo/error-archivo";
import { Respuesta } from "../../modelo/respuesta";
import { iif, of, ReplaySubject } from "rxjs";
import { FormControl, FormGroup } from "@angular/forms";
import { FileUploadValidators } from "@iplab/ngx-file-upload";
import { Consulta } from "../../modelo/consulta";
import { UsuarioDeudaService } from "../../servicio/usuario-deuda.service";
import { Router } from "@angular/router";
import { switchMap, takeUntil } from "rxjs/operators";
import { UsuarioDeudaContenedorService } from "../../servicio/usuario-deuda-contenedor.service";
import * as moment from "moment";

@Component({
  selector: 'app-cargar-archivo',
  templateUrl: './cargar-archivo.component.html',
  styleUrls: ['./cargar-archivo.component.css']
})
export class CargarArchivoComponent implements OnInit, OnDestroy, AfterViewInit {

  displayedColumns1: string[] = ['fila', 'mensaje'];
  dataSource1: MatTableDataSource<ErrorArchivo>;
  @ViewChild('TableOnePaginator', {static: true}) tableOnePaginator: MatPaginator;
  @ViewChild('TableOneSort', {static: true}) tableOneSort: MatSort;

  displayedColumns: string[] = ['id', 'id_deuda', 'mensaje', 'estado'];
  dataSource: MatTableDataSource<Respuesta>;
  @ViewChild('TableTwoPaginator', {static: true}) tableTwoPaginator: MatPaginator;
  @ViewChild('TableTwoSort', {static: true}) tableTwoSort: MatSort;

  // @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ViewChild(MatSort) sort: MatSort;

  private subs: ReplaySubject<void> = new ReplaySubject();

  public animation = true;
  public multiple = false;
  isDisabledBtnCargar = true;

  errorFile = false;
  errorFileText = '';
  messageFile = '';
  listIJsonFile: Consulta [] = [];

  public cargando = false;
  public cargadoArchivo = false;

  public erroresArchivo: ErrorArchivo[] = [];

  private filesControl = new FormControl(null, FileUploadValidators.filesLimit(2));

  private lineas: string[];


  public cargueForm = new FormGroup({
    fileUploadControl: this.filesControl
  });
  public previo: string = '';

  constructor(
    public usuarioDeudaService: UsuarioDeudaService,
    private contenedor: UsuarioDeudaContenedorService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.dataSource1 = new MatTableDataSource();
    this.dataSource = new MatTableDataSource();

    this.contenedor.resultadoInsert.asObservable().pipe(
      switchMap((valores) => {
        return iif(
          () => !!valores[0],
          of(valores)
        );
      }),
      takeUntil(this.subs)
    ).subscribe((datos) => {
      this.dataSource.data = datos;
      this.ngAfterViewInit();
    });

    this.cargueForm.controls.fileUploadControl.valueChanges.pipe(takeUntil(this.subs)).subscribe(
      file => {
        this.cargando = false;
        this.cargadoArchivo = false;
        if (file !== null && typeof file !== undefined && file !== '') {
          this.cargadoArchivo = true;
          this.onFileChange(file[0]);
          this.cargueForm.controls.fileUploadControl.reset();
        }
      }
    );
  }

  onFileChange(fileLoad): boolean {
    this.messageFile = '';
    this.errorFile = false;
    this.erroresArchivo = [];
    // const allowedExtensions = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    // console.log('Tipo de archivo ->' + fileLoad.type);
    const allowedExtensions = ['text/plain'];

    if (fileLoad === undefined) {
      this.cleanAll();
      return false;
    }

    if (allowedExtensions.indexOf(fileLoad.type) === -1) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Tipo de archivo no valido, solo debe cargar archivos tipo Txt',
        showConfirmButton: false,
        timer: 1500
      });
      this.errorFileText = 'Tipo de archivo no valido, solo debe cargar archivos tipo Txt';
      this.errorFile = true;

      this.cleanAll();
      return false;
    }

    if (fileLoad.size > 4000000) {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'Archivo demasiado grande, máximo 4 MB',
        showConfirmButton: false,
        timer: 1500
      });
      this.errorFileText = 'Archivo demasiado grande, maximo 4 MB';
      this.errorFile = true;

      this.cleanAll();
      return false;
    }

    //const workbook = new Excel.Workbook();

    const reader = new FileReader();
    let result;
    this.lineas = [];

    //let lineas: string[] = [];


    reader.readAsText(fileLoad);
    reader.onload = (e) => {
      result = reader.result;
      // console.log('contenido del archivo ------------- ', result);
      if (typeof result === 'string') {
        this.lineas = result.split('\n');

        if (!!this.lineas[1]) {
          this.previo = this.lineas[0] + '\n' + this.lineas[1];
        } else {
          this.previo = this.lineas[0];
        }

        this.cargadoArchivo = true;
        console.log('Datos de archivo ' + this.previo);
        //this.aplicarSugerencia(true);
        this.validarYDividir();

        //this.archivoNuevo.nombre = this.fileData.name;

      }
    };
  }

  validarYDividir() {

    console.log('pasa por aqui ====');

    const validacionLinea = new RegExp(/^([0-9a-zA-Z|-]{1,15})(;)([0-9a-zA-Z|\s]{1,60})(;)([0-9a-zA-Z|.|@]{1,60})(;)([0-9]{1,20})(;)([0-9a-zA-Z|-]{1,15})(;)([0-9|-]{10})$/);
    const validacionFecha = new RegExp(/^(3[01]|[12][0-9]|0[1-9])-(1[0-2]|0[1-9])-[0-9]{4}$/);
    const validacionCorreo = new RegExp(/([a-zA-Z0-9_\-\.]{1,})(@)([a-zA-Z0-9_\-\.]+)([a-zA-Z]{2,5})$/);
    let datos: string[] = [];

    let objJsonFile = new Consulta();
    const listJsonFile = [] as Array<Consulta>;

    const respuestas: Respuesta[] = [];
    let respuesta: Respuesta = new Respuesta();

    this.lineas.forEach((linea, index) => {
      linea = linea.replace('\r', '');
      console.log('--revisar ' + linea.replace('\r', '-'));

      if (validacionLinea.test(linea)) {
        // console.log('--valida ' + linea.replace('\n', '-'));

        datos = linea.split(';');

        if (validacionFecha.test(datos[5])) {

          if (validacionCorreo.test(datos[2])) {
            objJsonFile = new Consulta();
            objJsonFile.identificacion = datos[0];
            objJsonFile.nombre = datos[1];
            objJsonFile.correo = datos[2];
            objJsonFile.monto = Number(datos[3]);
            objJsonFile.id_deuda = datos[4];
            objJsonFile.fecha_vencimiento = moment(datos[5], 'DD-MM-YYYY').format('YYYY-MM-DD');


            respuesta = new Respuesta();
            respuesta.identificacion = objJsonFile.identificacion;
            respuesta.id_deuda = objJsonFile.id_deuda;
            respuestas.push(respuesta);

            listJsonFile.push(Object.assign({}, objJsonFile));
          } else {
            this.lineaError('Formato de correo invalido, debe ser xx@yyy.zz', index+1);

            /*const errorArc: ErrorArchivo = new ErrorArchivo();
            errorArc.filaError = index+1;
            errorArc.mensaje = 'Formato de correo invalido, debe ser xx@yyy.zz';
            this.erroresArchivo.push(errorArc);
            this.dataSource1.data = this.erroresArchivo;
            this.ngAfterViewInit();*/
          }


        } else {
          this.lineaError('Formato de fecha invalido, debe ser DD-MM-YYYY', index+1);

          /*const errorArc: ErrorArchivo = new ErrorArchivo();
          errorArc.filaError = index+1;
          errorArc.mensaje = 'Formato de fecha invalido, debe ser DD-MM-YYYY';
          this.erroresArchivo.push(errorArc);
          this.dataSource1.data = this.erroresArchivo;
          this.ngAfterViewInit();*/
        }

      } else {
        console.log('--invalida ' + linea);
        this.lineaError('Faltan campos en la fila o tiene un formato incorrecto', index+1);
        /*const errorArc: ErrorArchivo = new ErrorArchivo();
        errorArc.filaError = index+1;
        errorArc.mensaje = 'Faltan campos en la fila o tiene un formato incorrecto';
        this.erroresArchivo.push(errorArc);
        this.dataSource1.data = this.erroresArchivo;
        this.ngAfterViewInit();*/
      }
    });
    this.contenedor.resultadoInsert.next(respuestas);
    //reader.readAsText(this.fileData);

    this.listIJsonFile = listJsonFile;

    if (!!this.erroresArchivo[0]){
      this.isDisabledBtnCargar = true;
    } else {
      this.isDisabledBtnCargar = false;
    }

    if (this.listIJsonFile) {
      // this.isDisabledBtnCargar = false;
    } else {
      Swal.fire({
        position: 'top-end',
        icon: 'error',
        title: 'No se pudo cargar el archivo o esta vacio',
        showConfirmButton: false,
        timer: 1500
      });
    }


  }

  ngOnDestroy(): void {
    this.subs.next();
    this.subs.complete();
  }

  lineaError(mns: string, index: number): void {
    const errorArc: ErrorArchivo = new ErrorArchivo();
    errorArc.filaError = index+1;
    errorArc.mensaje = mns;
    this.erroresArchivo.push(errorArc);
    this.dataSource1.data = this.erroresArchivo;
    this.ngAfterViewInit();
  }

  private cleanAll(): void {
    this.cargadoArchivo = false;
    this.previo = '';
    this.listIJsonFile = [];
    this.isDisabledBtnCargar = true;
    this.messageFile = '';
    this.cargando = false;
    this.contenedor.resultadoInsert.next([]);
  }

  enviar(): void {
    /*for (const tercero of this.listIJsonFile) {
      this.terceroService.crearTercero(tercero);
    }*/

    this.listIJsonFile.forEach( (deuda) => {
      this.usuarioDeudaService.crearDeuda(deuda);
    });
    this.cargando = true;
    this.cargadoArchivo = false;
    this.previo = '';
  }

  ngAfterViewInit(): void {
    this.dataSource1.paginator = this.tableOnePaginator;
    this.dataSource1.sort = this.tableOneSort;

    this.dataSource.paginator = this.tableTwoPaginator;
    this.dataSource.sort = this.tableTwoSort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  applyFilter2(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource1.filter = filterValue.trim().toLowerCase();

    if (this.dataSource1.paginator) {
      this.dataSource1.paginator.firstPage();
    }
  }

  volver(): void{
    this.router.navigateByUrl('/tercero/listar');
  }
}
