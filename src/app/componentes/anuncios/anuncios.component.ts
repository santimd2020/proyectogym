import { Component, OnInit } from '@angular/core';
import { SistemaService } from '../../servicios/sistema.service/sistema.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import {environment} from '../../../environments/environment'

@Component({
  selector: 'app-anuncios',
  templateUrl: './anuncios.component.html',
  styleUrls: ['./anuncios.component.css']
})
export class AnunciosComponent implements OnInit {

  tablaanuncios = true;
  dtOptions: DataTables.Settings = {};
  anuncios
  load = false;

  constructor(private sistema: SistemaService,
    private route: Router) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      language: {
        url: "//cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json"
      },
    };

    this.sistema.getRequestAllAnuncios(`${environment.BASE_JORGE}/consultarAnuncios`, localStorage.getItem('token'))
      .subscribe(
        (data): any => {
          //Se guarda los datos que trae el json del serve, ala propiedad dietas.
          this.anuncios = data['anuncios']
          this.tablaanuncios = false;
          this.load = true;
          //Se imprime el mensaje del serve y se le notifica al usuario.
          if (this.anuncios == null) {
            //Se hace una validacion, en donde si dietas queda vacio signifca que el token vencio y se debe renovar.
            Swal.fire({
              position: 'warning',
              icon: 'warning',
              showConfirmButton: false,
              title: 'Error verifique el serve',
              timer: 2000
            })

          }
        },
        error => {
          Swal.fire({
            position: 'warning',
            icon: 'warning',
            showConfirmButton: false,
            title: 'No hay anuncios registrados',
            timer: 2000
          })
        })
  }



  eliminarAnunciosId(id) {

    this.sistema.deleteAnuncios(`${environment.BASE_JORGE}/eliminar/` + id, localStorage.getItem('token'))
      .subscribe(
        (data): any => {
          //Se imprime el mensaje del serve y se muestran la notificacion al usuario.

          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Se elimino correctamente',
            timer: 1000
          })
          window.location.reload();
        },
        (error) => {
          //En caso de error se imprime el mensaje de error del serve y se le notifica al usuario.

          this.load = true;//se oculta el spinner
          Swal.fire({
            icon: 'warning',
            title: '¡Atencion!',
            text: 'El id no se encuentra registrado',
            footer: 'Verifique el id ingresado'
          })
        }
      )
  }


  editarAnunciosPorId(id) {
    //Se guarda el parametro id en el localStorage para pasarlo para la consulta de ejercicio por id
    localStorage.setItem('id', id)
    //Se navega a la ruta de editar ejercicios
    this.route.navigate(['/editaranuncio']);


  }

  irAgregarAnuncios() {
    //Se redireciona a la pagina de aregagar ejercicios
    this.route.navigate(['/agregaranuncios']);
  }


  atras() {
    this.route.navigate(['/sistema']);
  }
}