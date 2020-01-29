import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  gradForm = new FormGroup({
    matricula : new FormControl('', [
      Validators.required,
      Validators.maxLength(11)
    ])
    
  });

  constructor( private fb: FormBuilder) { }

  ngOnInit() {
  }

  getOne(){
    //console.log(control.errors);
    console.log(this.gradForm);
  }

}
