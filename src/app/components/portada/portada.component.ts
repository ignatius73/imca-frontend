import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portada',
  templateUrl: './portada.component.html',
  styleUrls: ['./portada.component.css']
})
export class PortadaComponent implements OnInit {

  constructor( public router:Router) { }

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
