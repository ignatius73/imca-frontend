import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CabeceraComponent } from '../components/cabecera/cabecera.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';





@NgModule({
  declarations: [ NavbarComponent, CabeceraComponent ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule

  ],
  exports: [ NavbarComponent, CabeceraComponent ]
})
export class SharedModule { }
