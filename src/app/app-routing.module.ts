import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoUsuarioComponent } from './components/user/nuevo-usuario/nuevo-usuario.component';
import { PortadaComponent } from './components/portada/portada.component';
import { UsuariosComponent } from './components/user/usuarios/usuarios.component';
import { EditarUsuarioComponent } from './components/user/editar-usuario/editar-usuario.component';
import { CobrarComponent } from './components/cobrar/cobrar.component';
import { CajaComponent } from './components/caja/caja.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { ListaUserComponent } from './components/user/lista-user/lista-user.component';

const routes: Routes = [
  { path: 'home', component : PortadaComponent },
  { path: 'user', component : UsuariosComponent},
  { path: 'user/editarUsuario', component : EditarUsuarioComponent },
  { path: 'user/nuevoUsuario', component : NuevoUsuarioComponent },
  { path: 'user/listarUsuario', component : ListaUserComponent },
  { path: 'cobrar', component : CobrarComponent },
  { path: 'caja', component : CajaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
