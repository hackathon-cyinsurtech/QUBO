import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormsModule , FormGroup, Validators } from '@angular/forms'

import { AdminService } from '../../services/admin.service'
@Component({
    selector: 'app-admin',
    templateUrl: './admin.component.html'
  })

  export class AdminComponent implements OnInit {
      personList = [];
      carList = [];
      investList = [];
    constructor(  
        private adminService: AdminService,
        private router: Router
    ){

    }

    ngOnInit() {
        this.getKYCList();
        this.getKYCarList();
    }

   
    getKYCList() {
        this.adminService.getKYCList().subscribe(personList => {
            console.log(personList);
            this.personList = personList
        },(err) => {
            console.log(err._body);
        });
    }

    getKYCarList() {
        this.adminService.getKYCarList().subscribe(carList => {
            this.carList = carList
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
        this.adminService.approveKYC(data).subscribe(res => {
            for(var c:0; c < this.personList.length; c++) {
                this.personList[c].status = res.status;
            }
        },(err) => {
            console.log(err._body);
        });

    }

    rejectKYC(address) {
        const data = {
            address: address,
            status: 'R'
        };
        this.adminService.rejectKYC(data).subscribe(res => {
            for(var c:0; c < this.personList.length; c++) {
                this.personList[c].status = res.status;
            }
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
        this.adminService.approveKYCar(data).subscribe(res => {
            for(var c:0; c < this.carList.length; c++) {
                this.carList[c].status = res.status;
            }
        },(err) => {
            console.log(err._body);
        });

    }

    rejectKYCar(address, index) {
        const data = {
            address: address,
            status: 'R'
        };
        this.adminService.rejectKYCar(data).subscribe(res => {
            for(var c:0; c < this.carList.length; c++) {
                this.carList[c].status = res.status;
            }
        },(err) => {
            console.log(err._body);
        });
    }

}