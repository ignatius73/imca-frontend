import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NuevoUsuarioComponent } from './nuevo-usuario/nuevo-usuario.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { EditarUsuarioComponent } from './editar-usuario/editar-usuario.component';
import { FormularioUsuarioComponent } from './formulario-usuario/formulario-usuario.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';






@NgModule({
  declarations: [ NuevoUsuarioComponent, UsuariosComponent, EditarUsuarioComponent, FormularioUsuarioComponent ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    RouterModule,
    SharedModule

  ]
})
export class UserModule { }
