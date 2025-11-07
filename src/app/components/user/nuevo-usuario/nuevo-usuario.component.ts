import { Component, OnInit } from '@angular/core';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-nuevo-usuario',
  templateUrl: './nuevo-usuario.component.html',
  styleUrls: ['./nuevo-usuario.component.css']
})
export class NuevoUsuarioComponent implements OnInit {

  constructor(public alumnos:AlumnosService) {
    // Reset alumno when creating a new user
    this.alumnos.alumno = {};
   }

  ngOnInit(): void {

  }

}
