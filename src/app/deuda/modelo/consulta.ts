export class Consulta {
  identificacion: string;
  nombre:         string;
  correo:         string;
  id_deuda:          string;
  monto:             number;
  fecha_vencimiento: string;

  constructor() {
    this.fecha_vencimiento = '';
    this.monto = 0;
    this.id_deuda = '';
    this.correo = '';
    this.identificacion = '';
    this.nombre = '';
  }
}
