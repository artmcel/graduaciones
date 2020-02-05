import { Component, OnInit } from '@angular/core';
import  Swal  from 'sweetalert2';
import { MysqlService } from 'src/app/services/mysql.service';
//reactive forms
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
//pdf make
import pdfMake  from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  e : boolean = false;
  //matricula: string;
  impresion : any;
  data = [];
  tiket : boolean ;
  btn: boolean = false;
  //reactive forms
  gradForm = new FormGroup({
    matricula : new FormControl('', [
      Validators.required,
      Validators.maxLength(11)
    ])
  });
  
  constructor( private mysql: MysqlService, private fb: FormBuilder ) { }

  ngOnInit() {
  }
  
  /*
  entiendo() {
    this.e = true;
  }
  */

  getOne() {
    
    this.mysql.getOneS(this.gradForm.value.matricula).subscribe( data => {
      
      Swal.fire({
        title: 'Correcto',
        html: '<p>Matricula validada, cargando datos, por favor espere...</p><br><div class="spinner-border text-primary" role="status"><span class="sr-only">Loading...</span></div>',
        icon: 'success',
        timer: 2000,
        allowOutsideClick: false,
        showConfirmButton: false,
        onClose: () => {
          //this.tiket = true;
          this.data.push(data);
          console.log(data);
          //this.e = true;
          //this.share();
          window.open('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Funimexver.edu.mx%2Fprueba-facebook&amp;src=sdkpreparse','','width=360,height=640');
          this.imprimir();
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
          //this.tiket = false;
          console.log(this.tiket = false );
          location.reload();
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
          text: 'Parece que has llegado al limite de impresiones da click en OK e intentalo de nuevo.',
          icon: 'warning',
          allowOutsideClick: false,
          onClose: ()=> {
            location.reload();
          }
        });
      }else {
        this.mysql.updateImp(m, imp).subscribe( ()=>{
          console.log('actualizado');

          var boletos = {
            pageSize: 'Letter',
            content : [
              {
                text: 'Boletos para las graduaciones UNIMEX.\n\n',
                bold: true
              },
              {
                text: [
                  'Querido ', `${n}` ,' graduado de UNIMEX, debajo encontrarás tus datos personales, por favor ',
                  {text: 'revisalos cuidadosamente', bold: true},'.\n\n Si exite algún error llama a tu plantel inmediatamente.\n\n'
                ]
              },
              {
                table: {
                  body: [
                    [{text:'Matricula', bold: true}, {text:'Folio', bold: true}, {text: 'Nombre', bold: true}, {text: 'Carrera', bold: true}, {text: 'Codigo', bold: true}],
                    [`${m}`, `${f}`, `${n}`, `${c}`, {qr: `${m},${n},'Boleto:1'`, fit:75, foreground: '#004b93', background: 'white'}]
                  ]
                },
                layout: 'noBorders'
              },
              {text: '\n\n'},
              {
                table: {
                  body: [
                    [{text:'Matricula', bold: true}, {text:'Folio', bold: true}, {text: 'Nombre', bold: true}, {text: 'Carrera', bold: true}, {text: 'Codigo', bold: true}],
                    [`${m}`, `${f}`, `${n}`, `${c}`, {qr: `${m},${n},'Boleto:2'`, fit:75, foreground: '#004b93', background: 'white'}]
                  ]
                },
                layout: 'noBorders'
              },
              {text: '\n\n'},
              {
                table: {
                  body: [
                    [{text:'Matricula', bold: true}, {text:'Folio', bold: true}, {text: 'Nombre', bold: true}, {text: 'Carrera', bold: true}, {text: 'Codigo', bold: true}],
                    [`${m}`, `${f}`, `${n}`, `${c}`, {qr: `${m},${n},'Boleto:3'`, fit:75, foreground: '#004b93', background: 'white'}]
                  ]
                },
                layout: 'noBorders'
              }
            ],
            background: [
              {
                image: 'data:image/jpeg;base64,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',
                width: 100,
                height: 100,
                opacity: 0.5,
                alignment: 'center',
                margin: [250, 350, 0, 0]
              }
            ],
            footer: {
              text: 'Universidad Mexicana.\n Todos los derechos reservados.',
              alignment: 'center',
              bold: true,
            } 
          };

          pdfMake.createPdf(boletos).download('Boletos-UNIMEX'+`${m}`);
          this.btn = false;
          function regresar(){
            setTimeout( ()=>{
              location.reload();

            },2000)
          }
          regresar();
        }, error => {
          console.log(error);
        });
      }

    });
  }

}
