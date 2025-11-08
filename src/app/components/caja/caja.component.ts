import { Component, OnInit,Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from "@angular/common";
import { Caja } from 'src/app/interfaces/caja';
import { CajasService } from '../../services/cajas.service';
import { excelData } from 'src/app/interfaces/excelData';
import { UntypedFormGroup, UntypedFormBuilder, Validators, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ExceljsService } from 'src/app/services/exceljs.service';










@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  forma: UntypedFormGroup;
  movcaja: Caja = {};
  valor: boolean = false;
  errores: any = '';
  valido: boolean = false;
  datosCaja: Caja[];
  excel: excelData = {};
  hoy:Date;

  // Paginación
  paginaActual: number = 1;
  itemsPorPagina: number = 10;
  opcionesPorPagina: number[] = [10, 20, 50, 100];


  constructor( public caja:CajasService, public route:Router, private fb:UntypedFormBuilder,
              @Inject(LOCALE_ID) private locale: string, public excelToXls:ExceljsService) {



  }

  ngOnInit(): void {
    this.valido = true;
    this.crearFormulario();
    this.caja.getMovimientos();
  }

  crearFormulario(){
    this.forma = this.fb.group({
      
      detalle   :this.fb.control('', [Validators.required]),
      importe   : this.fb.control('', [Validators.required])
     
    });

   
   
  }

  procesar(){
    this.movcaja.detalle = this.forma.controls['detalle'].value;
    if ( this.forma.controls['importe'].value >= 0 ){
      this.movcaja.movimiento = "C";

    }else{
      this.movcaja.movimiento = "D";
    }
    this.movcaja.fecha = new Date();
    this.movcaja.importe = parseFloat( this.forma.controls['importe'].value);
    this.caja.nuevoMovimiento$( this.movcaja ).subscribe( (resp) =>{
      if ( resp['errors']){
        this.errores = resp['errors'];
      }

      this.caja.getMovimientos();
      this.paginaActual = 1; // Volver a la primera página


    });
  }

  cambiaInput(e:Event){
    
    if (this.forma.controls['importe'].value < 0) {
      this.valor = true;
  }else{
    this.valor = false;
  }
}

 bajarxlsx(){

   this.excel.title = "Caja Imca al día " + formatDate(Date.now(),'dd-MM-yyyy', this.locale);
   this.excel.headers = ['Fecha', 'Movimiento','Detalle','Importe','Recibo', 'Nombre', 'Apellido'];
   this.excel.data = this.caja.caja;
   this.excelToXls.exportExcel(this.excel);
 }

 // Métodos de paginación
 get itemsPaginados(): Caja[] {
   const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
   const fin = inicio + this.itemsPorPagina;
   return this.caja.caja.slice(inicio, fin);
 }

 onPageChange(pagina: number): void {
   this.paginaActual = pagina;
 }

 onItemsPerPageChange(items: number): void {
   this.itemsPorPagina = items;
   this.paginaActual = 1;
 }
}
