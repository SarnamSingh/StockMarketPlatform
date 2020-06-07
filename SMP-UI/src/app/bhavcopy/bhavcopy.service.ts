import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class BhavcopyService {
    constructor(private httpClient: HttpClient) {

    }

    uploadBhavCopy(bhavcopy: any): Observable<any> {
        const url = "/api/bhavcopy/equity";
        let body = JSON.stringify(bhavcopy);
        var options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        return this.httpClient.post(url, body, options);
    }

}