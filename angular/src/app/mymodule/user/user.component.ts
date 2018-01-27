import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormsModule , FormGroup, Validators } from '@angular/forms'

import { UserService } from '../../services/user.service'
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
  })

  export class UserComponent implements OnInit {
    addPersonForm: FormGroup;
    addCarForm: FormGroup;
    personMessageClass;
    personMessage;
    carMessageClass;
    carMessage;
    wallet_address;
    balance;
    personDetails;
    approveCars = [];
    constructor(  
        private userService: UserService,
        private formBuilder: FormBuilder,
        private router: Router
    ){

    }

    ngOnInit() {
        this.addKYCarForm()
        this.addKYCForm();
        // this.createForm();
        this.getEtherBalance();
        this.getPublic();
        this.getPersonDetails();
        this.getCarDetails();
        // this.getKYCStatus();
    }

    addKYCForm() {
        this.addPersonForm =  this.formBuilder.group({
            first_name: ['', Validators.compose([
                Validators.required
            ])],
            last_name : ['', Validators.compose([
                Validators.required
            ])],
            id_number : ['', Validators.compose([
                Validators.required
            ])],
        });
    }

    addKYCarForm() {
        this.addCarForm = this.formBuilder.group({
            license_plate: ['', Validators.compose([
                Validators.required
            ])],
            brand : ['', Validators.compose([
                Validators.required
            ])],
            model : ['', Validators.compose([
                Validators.required
            ])],
            category: ['', Validators.compose([
                Validators.required
            ])],
            engine_size: ['', Validators.compose([
                Validators.required
            ])],
            horse_power:  ['', Validators.compose([
                Validators.required
            ])],
            year:  ['', Validators.compose([
                Validators.required
            ])]
        })
    }

    addKYC() {
        const data = {
            first_name : this.addPersonForm.get('first_name').value,
            last_name: this.addPersonForm.get("last_name").value,
            id_number: this.addPersonForm.get("id_number").value
        }
        this.userService.addPersonDetails(data).subscribe(res => {
            this.personMessageClass = 'alert alert-success';
            this.personMessage = res.message;
        }, (err) => {
            this.personMessageClass = 'alert alert-danger';
            this.personMessage = err._body;
        })
    }

    addKYCar() {
        const data = {
            license_plate: this.addCarForm.get('license_plate').value, 
            brand: this.addCarForm.get('brand').value,
            model: this.addCarForm.get('model').value,
            category: this.addCarForm.get("category").value,
            engine_size: this.addCarForm.get("engine_size").value,
            horse_power: this.addCarForm.get("horse_power").value,
            year: this.addCarForm.get("year").value
        }
        this.userService.addCarDetails(data).subscribe(res => {
            this.carMessageClass = 'alert alert-success';
            this.carMessage = res.message;
        }, (err) => {
            this.carMessageClass = 'alert alert-danger';
            this.carMessage = err._body;
        })
    }

    getPublic() {
        this.userService.getPublicAddress().subscribe(res => {
            this.wallet_address = res.public_address
        },(err) => {
            this.wallet_address = "0x";
        });
    }

    getEtherBalance() {
        this.userService.getEtherBalance().subscribe(res => {
            this.balance = res;
        },(err) => {
            this.balance = 0;
        });
    }

    getPersonDetails() {
        this.userService.getPersonDetails().subscribe(personDetails => {
            this.personDetails = personDetails
        })
    }

    getCarDetails() {
        this.userService.getCarDetails().subscribe(approveCars => {
            this.approveCars = approveCars;
        },(err) => {
            console.log(err._body);
        });
    }


}