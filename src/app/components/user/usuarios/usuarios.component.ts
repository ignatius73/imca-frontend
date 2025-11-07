import { Component, OnInit, OnDestroy } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { RecibosService } from 'src/app/services/recibos.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  existe:Boolean = false;
  filtrar:string;
  valido:Boolean = false;
  loading:Boolean = false;
  respuesta:any;
  errores:any = '';
  private authSubscription?: Subscription;

  constructor(
    private fb:UntypedFormBuilder,
    public alumnos:AlumnosService,
    private route:Router,
    public recibos:RecibosService,
    private oidcSecurityService: OidcSecurityService
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authSubscription = this.oidcSecurityService.isAuthenticated$.subscribe(
      ({ isAuthenticated }) => {
        console.log('UsuariosComponent - Estado de autenticación:', isAuthenticated);
        this.valido = isAuthenticated;

        // Solo cargar usuarios si está autenticado
        if (isAuthenticated) {
          this.alumnos.getUsuarios();
        }
      }
    );
  }

  ngOnDestroy(): void {
    // Limpiar suscripción para evitar memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  cargarNuevoAlumno(){
   this.route.navigate(['/user/nuevoUsuario']);
  }

  cobrar( id:any ){
  this.buscaAlumno(id);
  this.route.navigate(['/cobrar']);


  }

  editar(id:any){
    this.buscaAlumno(id);
    this.route.navigate(['/user/editarUsuario'])
  
  }

  buscaAlumno(id:any){
    this.alumnos.alumnos.forEach((element) => {
      if( element._id == id){

        this.alumnos.alumno = element;
      };
    });
  }

  listar(idUsuario:any){
    this.buscaAlumno(idUsuario);
    this.route.navigate(['/user/listarUsuario'])
     
  }




}
