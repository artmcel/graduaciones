import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import  Swal  from 'sweetalert2';
import { MysqlService } from 'src/app/services/mysql.service';

import { PdfMakeWrapper, QR, Table } from 'pdfmake-wrapper';
import pdfFonts from 'pdfmake/build/vfs_fonts';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  e : boolean = false;
  matricula: string;
  impresion : any;
  data = [];
  tiket : boolean ;
  
  
  constructor( 
    private mysql: MysqlService
    ) { }
    
    ngOnInit() {
    }
    
    entiendo() {
      this.e = true;
    }
    
  getOne( form: NgForm ) {

    this.mysql.getOneS(this.matricula).subscribe( data => {
      
      Swal.fire({
        title: 'Correcto',
        html: '<p>Matricula validada, cargando datos, por favor espere...</p><br><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>',
        icon: 'success',
        timer: 2000,
        allowOutsideClick: false,
        showConfirmButton: false,
        onClose: () => {
          this.tiket = true;
          this.data.push(data);
          console.log(data);
        }
      });
    }, error => {

      Swal.fire({
        title: 'Error!',
        text: 'Tu matricula no coincide con alguna registrada en nuestra base de datos',
        icon: 'error',
        confirmButtonText: 'volver a intentar',
        allowOutsideClick: false,
        onClose: ()=> {
          this.tiket = false;
          console.log(this.tiket);
        }
      });
    });

  }

  imprimir(){

    let m = this.data[0][0].matricula;
    let f = this.data[0][0].folio;
    let n = this.data[0][0].nombre;
    let c = this.data[0][0].carrera;

    this.mysql.consultaImp(m).subscribe( data => {
      
      var imp = data[0].impresion;

      if (imp >= '4' ) {
        //console.log(imp);
        Swal.fire({
          title: 'Upss',
          text: 'Parece que has llegado al limite de impresiones, recargando la pagina.',
          icon: 'warning',
          allowOutsideClick: false,
          onClose: ()=> {
            location.reload();
          }
        });
      }else {
        this.mysql.updateImp(m, imp).subscribe( ()=>{
          console.log('actualizado');

          PdfMakeWrapper.setFonts(pdfFonts);
          const pdf = new PdfMakeWrapper();

          pdf.pageSize('letter');
          pdf.watermark('UNIMEX');
          pdf.permissions('', {
            copying: false,
            modifying: false,
          });

          pdf.header('Invitación para Graduaciones UNIMEX');
    
          pdf.add('Querido Graduado de UNIMEX, debajo encontraras tus datos personales, por favor revisalos cuidadosamente.');
          pdf.add(pdf.ln(1)); 
          
          pdf.add(
            new Table([
              ['Matricula', 'Folio', 'Nombre', 'Carrera'],
              [`${m}`, `${f}`, `${n}`, `${c}`]
            ]).end  
          );
          pdf.add(pdf.ln(1));

          pdf.add(new QR(`${m},${n}`).fit(50).end);
          
          pdf.footer('Unversidad Mexicana. Todos los derechos reservados');
          let titulo = 'invitaciones-UNIMEX'+m+'.pdf';
          pdf.create().download(titulo);

        }, error => {
          console.log(error);
        });
      }

    });
  }

}
