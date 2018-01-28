import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class InvestorService {
    apiUrl = "http://localhost:8000";
    constructor(
        private http: Http,
    ) {}

    getPublicAddress() {
        return this.http.get(
            this.apiUrl + '/investor/publicaddress'
        ).map(res => res.json());
    }

    getEtherBalance() {
        return this.http.get(
            this.apiUrl + '/investor/balance'
        ).map(res => res.json());
    }

};