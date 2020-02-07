import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import Swal from 'sweetalert2';

const httpOptionsPlain = {
  headers: new HttpHeaders({
    'Accept': 'text/plain',
    'Content-Type': 'text/plain'
  }),
  'responseType': 'text'
};

const httpOptions = {
  headers: new HttpHeaders({
    //'Content-Type': 'application/json'
    'Content-Type': 'application/x-www-form-urlencoded'
  }),
  observe: 'response' as 'body'
};

@Injectable({
  providedIn: 'root'
})
export class MysqlService {

  data = [];

  //private select = `http://192.168.1.123/codigos/consultas/serverS.php?mat=`;
  //private update = `http://192.168.1.123/codigos/consultas/serverUp.php?mat=`;
  
  select = `../php/consultas/serverS.php?mat=`;
  update = `../php/consultas/serverUp.php?mat=`;
  
  constructor( private http: HttpClient ) { }

  getOneS(matricula) {
    
    return this.http.get(`${this.select}${matricula}`);
    //console.log(`${this.url}${matricula}`);
  }

  consultaImp( matricula ) {
    return this.http.get(`${this.select}${matricula}`);
  }

  updateImp(matricula, imp){
    return this.http.post(`${this.update}${matricula}&imp=${imp}`, HttpHeaders, {responseType: 'text'});
  }

  /*
  updateImp(matricula, imp) {
    return this.http.put(`${this.update}${matricula}&imp=${imp}`, httpOptionsPlain, {responseType: 'text'});
  }
  */
  


}