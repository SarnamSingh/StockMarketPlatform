import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class HomeService{
constructor(private httpClient : HttpClient){}
getHtml(url:string){
    let headers = new HttpHeaders()
                          .set("Access-Control-Allow-Origin", "*")
                          .set('Access-Control-Allow-Methods', 'GET')
                          .set("Content-Type", "text/plain");
     return this.httpClient.get(url, {
       headers,
       responseType:'text',
       
     });
 }
}