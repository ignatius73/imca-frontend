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

        // Convertir importes a números para evitar concatenación
        this.caja = resp.devol.datos.map((item: any) => ({
          ...item,
          importe: parseFloat(item.importe) || 0
        }));
        this.saldo = parseFloat(resp.devol.suma) || 0;




      })

  }
  obtieneMovimientos$():Observable<any>{
    return this.http.get(`${ environment.apiUrl }/api/saldo`);
  }

  nuevoMovimiento$( movimiento:Caja):Observable<any>{
    return this.http.post(`${ environment.apiUrl}/api/movimientoCaja`, movimiento);
  }

  
    


  
 
}
