import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormsModule , FormGroup, Validators } from '@angular/forms'

@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
  })

  export class UserComponent implements OnInit {

    constructor(  
        private formBuilder: FormBuilder,
        private router: Router
    ){

    }

    ngOnInit() {
        // this.createForm();
        this.getEtherBalance();
        this.getKYCStatus();
    }

    getEtherBalance() {
      
    }

    getKYCStatus() {
        
    }


    

  }