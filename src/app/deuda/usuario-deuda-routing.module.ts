import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CrearDeudaComponent } from "./componentes/crear-deuda/crear-deuda.component";
import { EditarDeudaComponent } from "./componentes/editar-deuda/editar-deuda.component";
import { ListarDeudasComponent } from "./componentes/listar-deudas/listar-deudas.component";
import { ListarUsuariosComponent } from "./componentes/listar-usuarios/listar-usuarios.component";
import { ConsultarDeudaComponent } from "./componentes/consultar-deuda/consultar-deuda.component";

const routes: Routes = [
  {
    path: 'crear_deuda/:usuario',
    component: CrearDeudaComponent,
    data: {
      title: 'Crear Deuda '
    }
  },
  {
    path: 'editar_deuda/:usuario/:deuda',
    component: EditarDeudaComponent,
    data: {
      title: 'Editar Deuda '
    }
  },
  {
    path: 'listar_deuda/:usuario',
    component: ListarDeudasComponent,
    data: {
      title: 'Listar Deuda '
    }
  },
  {
    path: 'listar_usuario',
    component: ListarUsuariosComponent,
    data: {
      title: 'Listar Usuario '
    }
  },
  {
    path: 'consultar_deuda',
    component: ConsultarDeudaComponent,
    data: {
      title: 'Consultar Deuda '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuarioDeudaRoutingModule { }
