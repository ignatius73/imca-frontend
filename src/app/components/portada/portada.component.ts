import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { async } from 'rxjs';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.css']
})
export class PortadaComponent implements OnInit {

  constructor( public router:Router, public auth: AuthService) { }

  ngOnInit(): void {
  }

  usuario(){
    this.router.navigate(['/user']);

  }

  imprimir(){}

  cobrar(){
     this.router.navigate(['/caja']);

   }
   
  
 

}
