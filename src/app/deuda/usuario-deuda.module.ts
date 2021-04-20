import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioDeudaRoutingModule } from './usuario-deuda-routing.module';
import { ListarUsuariosComponent } from './componentes/listar-usuarios/listar-usuarios.component';
import { ListarDeudasComponent } from './componentes/listar-deudas/listar-deudas.component';
import { CrearDeudaComponent } from './componentes/crear-deuda/crear-deuda.component';
import { EditarDeudaComponent } from './componentes/editar-deuda/editar-deuda.component';
import { UsuarioDeudaService } from "./servicio/usuario-deuda.service";


@NgModule({
  declarations: [ListarUsuariosComponent, ListarDeudasComponent, CrearDeudaComponent, EditarDeudaComponent],
  imports: [
    CommonModule,
    UsuarioDeudaRoutingModule
  ],
  providers: [
    UsuarioDeudaService
  ]
})
export class UsuarioDeudaModule { }
