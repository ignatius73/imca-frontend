import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CajaComponent } from './caja.component';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { CabecerCajaComponent } from './cabecer-caja/cabecer-caja.component';
import { CajasService } from 'src/app/services/cajas.service';
import { SharedModule } from '../../shared/shared.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';










@NgModule({
  declarations: [ CajaComponent, CabecerCajaComponent ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
    


   
    

  ],
  providers: [ CajasService ]
})
export class CajaModule { }
