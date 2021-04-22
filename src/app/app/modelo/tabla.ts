export class TablaColumna {
  label: string;
  propiedad: string;
  tipo: string;
  visible: boolean;
  /*    sortOrder: NzTableSortOrder | null;
      sortFn: NzTableSortFn | null;*/
  cssClasses: string[];

  constructor() {
    this.label = '';
    this.propiedad = '';
    this.tipo = '';
    this.visible = true;
    /*this.sortOrder = null;
    this.sortFn = (a:NzTableData, b:NzTableData) => a.value.localeCompare(b.value);*/
    this.cssClasses = [];
  }
}

export class OpcionSelect {
  opcion: number;
  dato: any;

  constructor() {
    this.dato = null;
    this.opcion = -1;
  }
}

export class Opciones {
  opcion: number;
  icon: string;
  texto?: string;

  constructor() {
    this.icon = '';
    this.opcion = -1;
    this.texto = '';
  }
}
