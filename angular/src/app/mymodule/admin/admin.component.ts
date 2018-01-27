import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormsModule , FormGroup, Validators } from '@angular/forms'

import { AdminService } from '../../services/admin.service'
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.css']
  })

  export class AdminComponent implements OnInit {
      kycList = [];
      kycarList = [];
      investList = [];
    constructor(  
        private adminService: AdminService,
        private router: Router
    ){

    }

    ngOnInit() {
        
    }

   
    getKYCList() {
        this.adminService.getKYCList().subscribe(res => {
            this.kycList = res.kycList
        },(err) => {
            console.log(err._body);
        });
    }

    getKYCarList() {
        this.adminService.getKYCarList().subscribe(res => {
            this.kycarList = res.kycarList
        },(err) => {
            console.log(err._body);
        });
    }

    getInvestList() {
        this.adminService.getInvestList().subscribe(res => {
            this.investList = res.investList
        },(err) => {
            console.log(err._body);
        });
    }

    approveKYC(address) {
        const data = {
            address: address,
            status: 'A'
        };
        this.adminService.approveKYC().subscribe(res => {
             // change status
        },(err) => {
            console.log(err._body);
        });

    }

    rejectKYC(address) {
        const data = {
            address: address,
            status: 'R'
        };
        this.adminService.rejectKYC().subscribe(res => {
            // change status
        },(err) => {
            console.log(err._body);
        });
    }

    approveKYCar(address, index) {
        const data = {
            address: address,
            index: index,
            status: 'A'
        };
        this.adminService.approveKYCar().subscribe(res => {
            // change status
        },(err) => {
            console.log(err._body);
        });

    }

    rejectKYCar(address, index) {
        const data = {
            address: address,
            status: 'R'
        };
        this.adminService.rejectKYCar().subscribe(res => {
            // change status
        },(err) => {
            console.log(err._body);
        });
    }

}