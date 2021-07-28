import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { environment } from '../../../environments/environment';
import { Location } from '@angular/common';





@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  backendUri:string = environment.apiUrl;
baseUrl:string;


  constructor(public route:Router, 
              public auth: AuthService,
              public location:Location
                                   
              ) { 
                this.baseUrl = window.location.origin;
              }

  ngOnInit(): void {
  }

  

  

}
