import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class BhavcopyService {
    currentEnvironmentBaseURL: string;
    constructor(private httpClient: HttpClient) {
        this.currentEnvironmentBaseURL = environment.apiURL;
    }

    uploadBhavCopy(bhavcopy: any, bhavcopyType: string): Observable<any> {
        const url = bhavcopyType.toLowerCase() == "equity" ? "/bhavcopy/equity" : "/bhavcopy/fno";
        let body = JSON.stringify(bhavcopy);
        var options = {
            headers: new HttpHeaders({ 'Content-Type': 'application/json' })
        }
        return this.httpClient.post(this.currentEnvironmentBaseURL + url, body, options);
    }

    getTwoDayRelationship(twoDayRelationshipFilter: any): Observable<any> {
        const url = "/bhavcopy/equity/getTwoDayRelationship";
        let params = "/" + twoDayRelationshipFilter.fromDate + "/" + twoDayRelationshipFilter.toDate + "/" + twoDayRelationshipFilter.price
            + "/" + twoDayRelationshipFilter.fromFloorPointWidth + "/" + twoDayRelationshipFilter.toFloorPointWidth;
        // const httpParams = new HttpParams()
        // .set('fromDate', twoDayRelationshipFilter.fromDate)
        // .set('toDate', twoDayRelationshipFilter.toDate)
        // .set('price', twoDayRelationshipFilter.price)
        // .set('fromFloorPointWidth', twoDayRelationshipFilter.fromFloorPointWidth)
        // .set('toFloorPointWidth', twoDayRelationshipFilter.toFloorPointWidth);
        return this.httpClient.get(this.currentEnvironmentBaseURL + url + params);
    }

}