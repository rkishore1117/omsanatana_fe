import { Injectable } from '@angular/core';
// import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { URL } from '../../constants';
import { URL } from '../../constants';
import { URL1 } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private httpClient: HttpClient) { 
    
  }



  homepage():Observable<any>{
    // return this.httpClient.get(URL+"maincategory/")
    return this.httpClient.get(URL+"index/")

  }

  header():Observable<any>{
    return this.httpClient.get(URL+"maincategory/")
    // return this.httpClient.get(URL+"index/")

  }

  latestpage():Observable<any>{
    return this.httpClient.get(URL+"homeimages")
  }



}
