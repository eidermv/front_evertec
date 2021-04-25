import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ExcelJson } from "../modelo/export";

const TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public exportAsExcelFile(json: any[], archivoNombre: string): void {

    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const myworkbook: XLSX.WorkBook = { Sheets: { 'datos': myworksheet }, SheetNames: ['datos'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    ExcelService.saveAsExcelFile(excelBuffer, archivoNombre);
  }

  public exportAsExcel(json: ExcelJson, archivoNombre: string): void {

    const myworksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json.data, this.getOptions(json));
    const myworkbook: XLSX.WorkBook = { Sheets: { 'datos': myworksheet }, SheetNames: ['datos'] };
    const excelBuffer: any = XLSX.write(myworkbook, { bookType: 'xlsx', type: 'array' });
    ExcelService.saveAsExcelFile(excelBuffer, archivoNombre);
  }

  private getOptions(json: ExcelJson, origin?: number): any {
    // adding actual data
    const options = {
      skipHeader: true,
      origin: -1,
      header: []
    };
    options.skipHeader = json.skipHeader ? json.skipHeader : false;
    if (!options.skipHeader && json.header && json.header.length) {
      options.header = json.header;
    }
    if (origin) {
      options.origin = origin ? origin : -1;
    }
    console.log('----....>>>>> '+JSON.stringify(options));
    return options;
  }

  private static saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: TYPE
    });
    FileSaver.saveAs(data, fileName + EXTENSION);
  }
}
