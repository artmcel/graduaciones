import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import  Swal  from 'sweetalert2';
import { MysqlService } from 'src/app/services/mysql.service';

import { PdfMakeWrapper, QR } from 'pdfmake-wrapper';
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

      this.data.push(data);
      console.log(data);
      
    }, error => {

      this.tiket = false;
      console.log(this.tiket);

      //console.log('tu matricula no coincide');
      Swal.fire({
        title: 'Error!',
        text: 'Tu matricula no esta registrada en nuestra base de datos',
        icon: 'error',
        confirmButtonText: 'volver a intentar'
      });

    });

  }

  imprimir(){
    this.mysql.updateImp(this.matricula, this.impresion)
  }

  getPdf() {

    let n= this.data[0][0].nombre;
    let f= this.data[0][0].folio;

    console.log(n);

    // Set the fonts to use
    PdfMakeWrapper.setFonts(pdfFonts);

    const pdf = new PdfMakeWrapper();

    pdf.pageMargins([ 40, 60, 40, 60 ]);
    pdf.header('Boletos para Graduación UNIMEX');
    pdf.add('Tus datos son:');
    pdf.rawContent(n);
    pdf.create().download();

  }

}
