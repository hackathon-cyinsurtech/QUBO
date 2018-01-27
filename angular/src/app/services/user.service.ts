import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class UserService {
    apiUrl = "http://localhost:8000";
    constructor(
        private http: Http,
    ) {}

    getPublicAddress() {
        return this.http.get(
            this.apiUrl + '/user/generate'
        ).map(res => res.json());
    }

    getEtherBalance() {
        return this.http.get(
            this.apiUrl + '/user/generate'
        ).map(res => res.json());
    }

    addPersonDetails (data) {
        return this.http.post(
            this.apiUrl + '/wallet/generate/check',
            data
        ).map(res => res.json());
    }

};