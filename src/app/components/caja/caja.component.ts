import { Component, OnInit,Inject, LOCALE_ID } from '@angular/core';
import { Router } from '@angular/router';
import { formatDate } from "@angular/common";
import { Caja } from 'src/app/interfaces/caja';
import { CajasService } from '../../services/cajas.service';
import { excelData } from 'src/app/interfaces/excelData';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { ExceljsService } from 'src/app/services/exceljs.service';










@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.css']
})
export class CajaComponent implements OnInit {
  forma: FormGroup;
  movcaja: Caja = {};
  valor: boolean = false;
  errores: any = '';
  valido: boolean = false;
  datosCaja: Caja[];
  excel: excelData = {};
  hoy:Date;

 
  constructor( public caja:CajasService, public route:Router, private fb:FormBuilder, public auth:AuthService,
              @Inject(LOCALE_ID) private locale: string, public excelToXls:ExceljsService) { 
   
   
   
  }

  ngOnInit(): void {
    this.auth.user$.subscribe( (resp) =>{
      if ( resp['email'] == environment.jana || resp['email'] == environment.gabo) {
        this.valido = true;
        this.crearFormulario();
        this.caja.getMovimientos();
      }
     
    });
    
    
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
    this.movcaja.importe = parseFloat( this.forma.controls['importe'].value);
    this.caja.nuevoMovimiento$( this.movcaja ).subscribe( (resp) =>{
      console.log(resp);
      if ( resp['errors']){
        console.log(resp['errors']);
        this.errores = resp['errors'];
      }

      this.caja.getMovimientos();
     

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
   this.excel.headers = ['Fecha', 'Movimiento','Detalle','Importe','Recibo'];
   this.excel.data = this.caja.caja;
   console.log(JSON.stringify(this.excel));
   this.excelToXls.exportExcel(this.excel);
 }
}
