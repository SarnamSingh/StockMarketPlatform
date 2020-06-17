import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class BhavcopyService {
    constructor(private httpClient: HttpClient) {

    }

    uploadBhavCopy(bhavcopy: any, bhavcopyType: string): Observable<any> {
        const url = bhavcopyType.toLowerCase()=="equity"? "/api/bhavcopy/equity":"/api/bhavcopy/fno";
        let body = JSON.stringify(bhavcopy);
        var options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        return this.httpClient.post(url, body, options);
    }

}