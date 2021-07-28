import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Event, Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Alumno } from '../../../interfaces/alumno';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  existe:Boolean = false;
  filtrar:string;





  constructor( private fb:FormBuilder, public alumnos:AlumnosService, private route:Router ) {



   }

  ngOnInit(): void {
    this.alumnos.getUsuarios();


  }

  cargarNuevoAlumno(){
   this.route.navigate(['/user/nuevoUsuario']);
  }

  cobrar( id:any ){
  this.buscaAlumno(id);
  /*  this.alumnos.alumnos.forEach((element) => {
      if( element._id == id){

        this.alumnos.alumno = element;
      };
    });*/

    this.route.navigate(['/cobrar']);


  }

  editar(id:any){
    this.buscaAlumno(id);
    this.route.navigate(['/user/editarUsuario'])
    //console.log(id);
  }

  buscaAlumno(id:any){
    this.alumnos.alumnos.forEach((element) => {
      if( element._id == id){

        this.alumnos.alumno = element;
      };
    });
  }




}
