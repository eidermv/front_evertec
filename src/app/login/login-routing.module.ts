import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from "./componentes/login/login.component";

const routes: Routes = [
  {
    path: 'iniciar',
    component: LoginComponent,
    data: {
      title: 'Iniciar Sesion '
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginRoutingModule { }
