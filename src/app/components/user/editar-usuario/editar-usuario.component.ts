import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {

  constructor(public alumnos:AlumnosService, private fb:FormBuilder, private route:Router) {

    console.log(this.alumnos.alumno);
   }

  ngOnInit(): void {
  }

}
