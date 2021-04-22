export class Deuda {
  id_deuda:          string;
  monto:             number;
  fecha_vencimiento: string;

  constructor() {
    this.fecha_vencimiento = '';
    this.monto = 0;
    this.id_deuda = '';
  }
}
