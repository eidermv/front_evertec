import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "./app/permiso/auth.guard";

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'usuario',
    canActivate: [AuthGuard],
    loadChildren: () => import('./deuda/usuario-deuda.module').then(m => m.UsuarioDeudaModule)
  },
  {path: '', redirectTo: '/login/iniciar', pathMatch: 'full'},
  {path: '**', redirectTo: '/login/iniciar', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
