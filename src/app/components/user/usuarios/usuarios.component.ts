import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { RecibosService } from 'src/app/services/recibos.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  existe:Boolean = false;
  filtrar:string;
  loading:Boolean = false;
  respuesta:any;
  errores:any = '';

  constructor(
    private fb:UntypedFormBuilder,
    public alumnos:AlumnosService,
    private route:Router,
    public recibos:RecibosService
  ) {}

  ngOnInit(): void {
    // El AuthGuard garantiza que solo usuarios autenticados lleguen aquí
    this.alumnos.getUsuarios();
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
