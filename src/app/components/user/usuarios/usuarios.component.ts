import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';

import { AuthService } from '@auth0/auth0-angular';

import { RecibosService } from 'src/app/services/recibos.service';



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
  errores:any = '';





  constructor( private fb:FormBuilder, 
               public alumnos:AlumnosService, 
               private route:Router, 
               public auth:AuthService,
               public recibos:RecibosService ) {



   }

  ngOnInit(): void {
    this.auth.user$.subscribe( (resp) =>{
        this.valido = true;
        this.alumnos.getUsuarios();
    
    });



  }

  cargarNuevoAlumno(){
   this.route.navigate(['/user/nuevoUsuario']);
  }

  cobrar( id:any ){
  this.buscaAlumno(id);
  this.route.navigate(['/cobrar']);


  }

  editar(id:any){
    this.buscaAlumno(id);
    this.route.navigate(['/user/editarUsuario'])
  
  }

  buscaAlumno(id:any){
    this.alumnos.alumnos.forEach((element) => {
      if( element._id == id){

        this.alumnos.alumno = element;
      };
    });
  }

  listar(idUsuario:any){
    this.buscaAlumno(idUsuario);
    this.route.navigate(['/user/listarUsuario'])
     
  }




}
