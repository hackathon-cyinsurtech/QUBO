import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { UserComponent } from './user/user.component'
import { InvestorComponent } from './investor/invest.component'
import { AdminComponent } from './admin/admin.component'

const routes: Routes = [
    {
        path: 'user',
        component: UserComponent
    },
    {
        path: 'investor',
        component: InvestorComponent
    },
    {
        path: 'admin',
        component: AdminComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MyModuleRoutingModule { }