import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Caja } from '../interfaces/caja';
import { element } from 'protractor';




@Injectable({
  providedIn: 'root'
})
export class CajasService {
caja:Caja[] = [];
saldo:number = 0;
  constructor( private http:HttpClient) { }


  getMovimientos(){
    this.obtieneMovimientos$()
      .subscribe( (resp) =>{
        
        this.caja = resp.devol.datos;
        this.saldo = resp.devol.suma;
       
        
      
        
      })
    
  }
  obtieneMovimientos$():Observable<any>{
    return this.http.get(`${ environment.apiUrl }/api/saldo`);
  }

  nuevoMovimiento$( movimiento:Caja):Observable<any>{
    return this.http.post(`${ environment.apiUrl}/api/movimientoCaja`, movimiento);
  }

  
    


  
 
}
