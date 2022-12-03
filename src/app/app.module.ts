import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PortadaComponent } from './components/portada/portada.component';
import { UserModule } from './components/user/user.module';
import { CobrarComponent } from './components/cobrar/cobrar.component';
import { CajaModule } from './components/caja/caja.module';
import { SharedModule } from './shared/shared.module';
import { ScrollingModule } from '@angular/cdk/scrolling'
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from '../environments/environment';


  










@NgModule({
  declarations: [
    AppComponent,
    PortadaComponent,
    CobrarComponent
    
    
    
    
  

   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    CajaModule,
    ReactiveFormsModule,
    HttpClientModule,
    Ng2SearchPipeModule,
    SharedModule,
    ScrollingModule,
    AuthModule.forRoot({
      domain: environment.auth0.domain,
      clientId: environment.auth0.clientId
     
    }),
    

  ],
  exports: [
    ScrollingModule
  ],
  

  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
