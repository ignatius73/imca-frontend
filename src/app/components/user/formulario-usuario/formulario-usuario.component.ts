import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Alumno } from 'src/app/interfaces/alumno';
import { AlumnosService } from '../../../services/alumnos.service';

@Component({
  selector: 'app-formulario-usuario',
  templateUrl: './formulario-usuario.component.html',
  styleUrls: ['./formulario-usuario.component.css']
})
export class FormularioUsuarioComponent implements OnInit {

  forma = new FormGroup({
              nombre   : new FormControl(''),
              apellido : new FormControl(''),
              dni      : new FormControl(''),
              edad     : new FormControl(''),
              direccion :new FormControl(''),
              email    : new FormControl(''),
              telefono : new FormControl(''),
              img      : new FormControl('')

  });

   alumno: Alumno = {};
   imgPreview: string | ArrayBuffer = '';
   @Output()
   propagar= new EventEmitter<FormGroup>();
   errores:any = '';





  constructor(public alumnos:AlumnosService, private route:Router) {
    console.log(this.alumnos.alumno);
    this.alumno = this.alumnos.alumno;
  }


  ngOnInit(): void {}




  selectImage(e:Event){}

  enviar(){
    this.alumno.nombre = this.forma.controls['nombre'].value;
    this.alumno.apellido = this.forma.controls['apellido'].value;
    this.alumno.dni = this.forma.controls['dni'].value;
    this.alumno.edad = this.forma.controls['edad'].value;
    this.alumno.email = this.forma.controls['email'].value;
    this.alumno.direccion = this.forma.controls['direccion'].value;
    this.alumno.telefono = this.forma.controls['telefono'].value;
    this.alumno.img = this.forma.controls['img'].value;

    if(this.alumno._id === undefined ){
      
    this.alumnos.nuevoUsuario$(this.alumno).subscribe( (resp)=>{
        if ( resp['errors'] ){
          this.errores = resp['errors'];
          console.log(this.errores);



        }else{

          this.route.navigate(['/user'])
        }

    });
  }else{
    //this.alumnos.nuevoUsuario$(this.alumno).subscribe( (resp)=>{
    this.alumnos.editaUsuario$(this.alumno).subscribe( ( resp) =>{
      if ( resp['errors'] ){
        this.errores = resp['errors'];
        console.log(this.errores);



      }else{
        console.log(resp)
        this.alumno
        this.route.navigate(['/user'])
      }

    })
  }


    //this.imgPreview = null;
  }

}
