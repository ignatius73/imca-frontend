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
import { ROLES } from './config/roles.config';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component : PortadaComponent },
  // La ruta /user ahora está protegida para guardar URL y redirigir después del login
  { path: 'user', component : UsuariosComponent, canActivate: [AuthGuard] },
  // Las sub-rutas SÍ están protegidas porque requieren datos de usuarios autenticados
  { path: 'user/editarUsuario', component : EditarUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'user/nuevoUsuario', component : NuevoUsuarioComponent, canActivate: [AuthGuard] },
  { path: 'user/listarUsuario', component : ListaUserComponent, canActivate: [AuthGuard] },
  { path: 'cobrar', component : CobrarComponent, canActivate: [AuthGuard] },
  // La ruta /caja requiere autenticación Y el rol definido en ROLES.ADMIN
  {
    path: 'caja',
    component : CajaComponent,
    canActivate: [AuthGuard],
    data: { roles: [ROLES.ADMIN] }
  },
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
