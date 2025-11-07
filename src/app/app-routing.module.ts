import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NuevoUsuarioComponent } from './components/user/nuevo-usuario/nuevo-usuario.component';
import { PortadaComponent } from './components/portada/portada.component';
import { UsuariosComponent } from './components/user/usuarios/usuarios.component';
import { EditarUsuarioComponent } from './components/user/editar-usuario/editar-usuario.component';
import { CobrarComponent } from './components/cobrar/cobrar.component';
import { CajaComponent } from './components/caja/caja.component';
import { AuthGuard } from './guards/auth.guard';
import { ListaUserComponent } from './components/user/lista-user/lista-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component : PortadaComponent },
  // La ruta /user NO está protegida para permitir acceso al botón de login
  { path: 'user', component : UsuariosComponent },
  // Las sub-rutas SÍ están protegidas porque requieren datos de usuarios autenticados
  { path: 'user/editarUsuario', component : EditarUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'user/nuevoUsuario', component : NuevoUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'user/listarUsuario', component : ListaUserComponent, canActivate: [AuthGuard] },
  { path: 'cobrar', component : CobrarComponent, canActivate: [AuthGuard] },
  { path: 'caja', component : CajaComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: false,
    enableTracing: false
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
