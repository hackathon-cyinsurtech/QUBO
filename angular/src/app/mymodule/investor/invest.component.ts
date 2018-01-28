import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router'
import { FormControl,FormBuilder, FormsModule , FormGroup, Validators } from '@angular/forms'

import { InvestorService } from '../../services/investor.service'
@Component({
    selector: 'app-investor',
    templateUrl: './invest.component.html'
  })

  export class InvestorComponent implements OnInit {
    investMessageClass;
    investMessage;
    wallet_address;
    balance;
    approveCars = [];
    constructor(  
        private investorService: InvestorService,
        private formBuilder: FormBuilder,
        private router: Router
    ){

    }

    ngOnInit() {
        this.getEtherBalance();
        this.getPublic();
    }

    getPublic() {
        this.investorService.getPublicAddress().subscribe(res => {
            this.wallet_address = res.public_address
        },(err) => {
            this.wallet_address = "0x";
        });
    }

    getEtherBalance() {
        this.investorService.getEtherBalance().subscribe(res => {
            this.balance = res;
        },(err) => {
            this.balance = 0;
        });
    }

}