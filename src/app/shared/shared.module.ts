import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../components/navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { CabeceraComponent } from '../components/cabecera/cabecera.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PaginatorComponent } from './paginator/paginator.component';





@NgModule({
  declarations: [ NavbarComponent, CabeceraComponent, PaginatorComponent ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule

  ],
  exports: [ NavbarComponent, CabeceraComponent, PaginatorComponent ]
})
export class SharedModule { }
