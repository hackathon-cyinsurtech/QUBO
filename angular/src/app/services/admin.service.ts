import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class AdminService {
    apiUrl = "http://localhost:8000";
    constructor(
        private http: Http,
    ) {}

    getKYCList() {
        return this.http.get(
            this.apiUrl + '/admin/personlist'
        ).map(res => res.json());
    }

    getKYCarList() {
        return this.http.get(
            this.apiUrl + '/admin/carlist'
        ).map(res => res.json());
    }

    getInvestList() {
        return this.http.get(
            this.apiUrl + '/admin/investlist'
        ).map(res => res.json());
    }


    approveKYC (data) {
        return this.http.post(
            this.apiUrl + '/admin/approveperson',
            data
        ).map(res => res.json());
    }

    rejectKYC(data) {
        return this.http.post(
            this.apiUrl + '/admin/rejectperson',
            data
        ).map(res => res.json());
    }

    approveKYCar (data) {
        return this.http.post(
            this.apiUrl + '/admin/rejectperson',
            data
        ).map(res => res.json());
    }

};