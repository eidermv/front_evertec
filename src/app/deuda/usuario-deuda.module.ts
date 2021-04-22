import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioDeudaRoutingModule } from './usuario-deuda-routing.module';
import { ListarUsuariosComponent } from './componentes/listar-usuarios/listar-usuarios.component';
import { ListarDeudasComponent } from './componentes/listar-deudas/listar-deudas.component';
import { CrearDeudaComponent } from './componentes/crear-deuda/crear-deuda.component';
import { EditarDeudaComponent } from './componentes/editar-deuda/editar-deuda.component';
import { UsuarioDeudaService } from "./servicio/usuario-deuda.service";
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { NgbPopoverModule } from "@ng-bootstrap/ng-bootstrap";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTableModule } from "@angular/material/table";
import { UsuarioDeudaContenedorService } from "./servicio/usuario-deuda-contenedor.service";
import { MatButtonModule } from "@angular/material/button";
import { MatSortModule } from "@angular/material/sort";


@NgModule({
  declarations: [ListarUsuariosComponent, ListarDeudasComponent, CrearDeudaComponent, EditarDeudaComponent],
  imports: [
    CommonModule,
    UsuarioDeudaRoutingModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    NgbPopoverModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatSortModule
  ],
  providers: [
    UsuarioDeudaService,
    UsuarioDeudaContenedorService
  ]
})
export class UsuarioDeudaModule { }
