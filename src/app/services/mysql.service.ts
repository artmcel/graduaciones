import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MysqlService {

  data = [];

  url = `http://192.168.1.123/codigos/server.php?mat=`;
  //urlC = `http://192.168.1.123/codigos/server.php?mat=${matricula}`;

  constructor( private http: HttpClient ) { }

  /*
  getAllDataS(){
    this.http.get(this.url).subscribe( data =>{
      this.data.push(data);
      console.log(data);
    })
  }
  */

  getOneS(matricula) {
    
    return this.http.get(`${this.url}${matricula}`);
    //console.log(`${this.url}${matricula}`);
  }

  updateImp(matricula, impresion) {
    console.log(matricula, impresion);
    //this.http.put(this.url)
  }
}
