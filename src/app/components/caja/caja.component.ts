import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Caja } from 'src/app/interfaces/caja';
import { CajasService } from '../../services/cajas.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';









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

 
  constructor( public caja:CajasService, public route:Router, private fb:FormBuilder, public auth:AuthService) { 
   
   
   
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


}
