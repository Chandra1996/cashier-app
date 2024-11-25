import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getData(apiUrl:string, payload:any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json', // Ensure JSON format
    });
  
    return this.httpClient.post(apiUrl, payload, { headers })
  }
}
