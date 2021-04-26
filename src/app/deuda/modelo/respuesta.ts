export class Respuesta {
  identificacion: string;
  id_deuda: string;
  error: number;
  mensaje: string;

  constructor() {
    this.identificacion = '';
    this.id_deuda = '';
    this.error = -100;
    this.mensaje = 'Esperando respuesta';
  }

}
