import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';


import { MyModuleRoutingModule } from './mymodule.routing'

import { UserService } from '../services/user.service';
import { UserComponent } from './user/user.component'

import { AdminService } from '../services/admin.service';
import { AdminComponent } from './admin/admin.component';

import { InvestorService } from '../services/investor.service'
import { InvestorComponent } from './investor/invest.component'

@NgModule({
    declarations: [
        UserComponent,
        AdminComponent,
        InvestorComponent

    ],
    imports: [
        CommonModule, 
        ReactiveFormsModule,
        FormsModule, 
        HttpModule,
        MyModuleRoutingModule
    ],
    providers: [
        UserService,
        AdminService,
        InvestorService
        // AuthGuardService,
        // WalletGuardService,
    ]
})
export class MyModuleModule { }