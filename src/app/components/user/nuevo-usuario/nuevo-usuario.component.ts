import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {

  constructor(public alumnos:AlumnosService) {
    if( this.alumnos.alumno !== {} ){
      this.alumnos.alumno = {};
    }
   }

  ngOnInit(): void {

  }

}
