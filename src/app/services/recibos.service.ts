import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Remito } from '../interfaces/remito';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Recibo } from '../interfaces/recibo';




@Injectable({
  providedIn: 'root'
})
export class RecibosService {
  recibo: any;
  id: any;

  constructor( private http: HttpClient) { }

  obtieneRecibo$( recibo: Recibo):Observable<any>{
   return this.http.post(`${ environment.apiUrl}/api/nuevoRecibo`, recibo);
  }

  obtieneListado$( id:any):Observable<any>{
    const idUsuario =  {
      idUsuario:id
    }
    return this.http.post(`${ environment.apiUrl}/api/ListMovCajaAlumno`, idUsuario);
  }

}
