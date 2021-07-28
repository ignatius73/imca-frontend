import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Alumno } from '../interfaces/alumno';

@Injectable({
  providedIn: 'root'
})
export class AlumnosService {
nrodni: number = 0;
usuario: Alumno[] = [];
alumnos: Alumno[] = [];
alumno:Alumno = {};

  constructor( private http: HttpClient ) { }


  getUsuario( dni:number ):any{
    this.nrodni = dni;
    this.consultaUsuario$().subscribe( (resp) =>{
     if (!resp["user"]) {
       console.log(resp.message);
      return false;
     }else{
       this.usuario = resp['user'];
       return true;
     }

    } );

   }

   consultaUsuario$( ): Observable<any>{
     const param: number = this.nrodni;
     return this.http.get(`${ environment.apiUrl }/api/usuario?email=${ this.nrodni}`)
         };


   obtieneUsuarios$():Observable<any>{
    return this.http.get(`${ environment.apiUrl }/api/usuarios`);
   }


  getUsuarios():any{
    this.obtieneUsuarios$().subscribe( (resp) =>{
      if (!resp["alumnos"]) {
        console.log(resp.message);
       return false;
      }else{
        this.alumnos = resp['alumnos'];
        return true;
      }

     } );




}

nuevoUsuario$( alumno: Alumno):Observable<any>{
  return this.http.post(`${environment.apiUrl}/api/nuevoAlumno`, alumno);
}

editaUsuario$ ( alumno: Alumno ):Observable<any>{
  return this.http.post(`${environment.apiUrl}/api/editaAlumno`, alumno);
}

}
