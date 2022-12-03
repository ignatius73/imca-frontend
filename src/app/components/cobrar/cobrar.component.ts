import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, FormArray, FormsModule } from '@angular/forms';
import { Remito } from 'src/app/interfaces/remito';
import { AlumnosService } from '../../services/alumnos.service';
import  printJS  from 'print-js';
import html2canvas from 'html2canvas';
import { RecibosService } from '../../services/recibos.service';
import { Alumno } from 'src/app/interfaces/alumno';
import { Recibo } from '../../interfaces/recibo';
import { Router } from '@angular/router';
import { CabeceraComponent } from '../cabecera/cabecera.component';
import { CajasService } from '../../services/cajas.service';
import { Caja } from '../../interfaces/caja';








@Component({
  selector: 'app-cobrar',
  templateUrl: './cobrar.component.html',
  styleUrls: ['./cobrar.component.css']

})
export class CobrarComponent implements OnInit {
  forma: FormGroup;
  detalles1: string[];
  importes1: number[];
  recibo: Recibo = {};
  dia: number;
  mes:number;
  anio: number;
  valor:any;
  importe:any;
  total: number = 0;
  indice:number = 0;
  botonera:boolean = true;
  borders: boolean = true;
  fecha: Date;
  print: boolean = false;
  movCaja: Caja = {};



  constructor( public alumnos:AlumnosService, private fb:FormBuilder, public recibos:RecibosService, private route:Router, private caja:CajasService ) {
      if ( this.alumnos.alumno._id == undefined ){
        this.route.navigate(['/user']);

      }

   }

  ngOnInit(): void {
    this.crearFormulario();
    this.fecha = new Date();
    
  }


procesar(){}
  //getters

  get detalles() {
    return this.forma.get('detalles') as FormArray;

  }
  get importes() {
    return this.forma.get('importes') as FormArray;

  }



  setTotal(){

    this.forma.controls['totalimporte'].setValue( this.total );

  }

  crearFormulario(){
    this.forma = this.fb.group({
      detalles: this.fb.array([]),
      importes: this.fb.array([]),
      totalimporte: this.fb.control('')



    });



  }


  agregarFila( valor:any){
    this.print = false;
    this.detalles.push( this.fb.control(''));
    this.importes.push( this.fb.control(''));


  }

  agregaTotal( e:any ){
    this.total = this.total + +e.value;





  }

  cobrar( ){

    this.recibo.idUsuario = this.alumnos.alumno._id;
    this.recibo.apellidoUsuario = this.alumnos.alumno.apellido;
    this.recibo.nombreUsuario = this.alumnos.alumno.nombre;

    this.recibo.detalles = this.forma.controls['detalles'].value;
    this.recibo.importes = this.forma.controls['importes'].value;
    this.detalles1 = this.forma.controls['detalles'].value;
    this.importes1 = this.forma.controls['importes'].value;




    this.recibo.importes?.forEach( e =>{
      this.total = this.total + e;
    })

    this.setTotal();
    this.recibo.total = this.forma.controls['totalimporte'].value;


    this.recibos.obtieneRecibo$( this.recibo ).subscribe( resp =>{
      if ( resp['errors'] ){
        console.log(resp['errors']);
      }

      this.recibo.nroRecibo = resp.recibo.nroRecibo;
      this.movimientoCaja();
      this.caja.nuevoMovimiento$( this.movCaja ).subscribe( (resp) =>{

        this.print = true;
    })



    })


    }

    imprimir(){

      window.print();
    }

    volver(){

      this.route.navigate(['/user']);
    }

    movimientoCaja(){
     this.movCaja.movimiento = "C";
     this.movCaja.importe = this.recibo.total;
     this.movCaja.detalle = `Recibo ${ this.recibo.nroRecibo }`;
     this.movCaja.name = this.alumnos.alumno.nombre;
     this.movCaja.last_name = this.alumnos.alumno.apellido


    }



}
