import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Event, Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { Alumno } from '../../../interfaces/alumno';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  existe:Boolean = false;
  filtrar:string;
  valido:Boolean = false;
  loading:Boolean = false;
  respuesta:any;





  constructor( private fb:FormBuilder, public alumnos:AlumnosService, private route:Router, public auth:AuthService ) {



   }

  ngOnInit(): void {
    this.auth.user$.subscribe( (resp) =>{
      if ( resp['email'] == environment.jana || resp['email'] == environment.gabo || resp['email'] == environment.imca) {
        this.valido = true;
        this.loading = true;
        this.alumnos.getUsuarios();
          
            

       
      }

    });



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
