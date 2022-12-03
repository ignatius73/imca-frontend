import { Component, OnInit } from '@angular/core';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { RecibosService } from 'src/app/services/recibos.service';

@Component({
  selector: 'app-lista-user',
  templateUrl: './lista-user.component.html',
  styleUrls: ['./lista-user.component.css']
})
export class ListaUserComponent implements OnInit {
  recibosUser: any;
  loading:Boolean = true

  constructor( public alumnos:AlumnosService, public recibos: RecibosService) {
    
    
    this.recibos.obtieneListado$(this.alumnos.alumno._id).subscribe( resp =>{
      if ( resp ){
        this.loading = false
        this.recibosUser = resp
        
      }
      
        
    });
   }

  ngOnInit(): void {
  }

}
