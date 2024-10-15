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
export class ReligiousService {

  constructor(private httpClient: HttpClient) { }



  categeories():Observable<any>{
    return this.httpClient.get(URL+"maincategory/")

  }



subcategeories(_id: string):Observable<any>{
  return this.httpClient.get(URL+'maincategory/'+_id+'/categories/')

}

minisubcategeories(_id: string):Observable<any>{
  return this.httpClient.get(URL+'category/'+_id+'/subcategories/')
}
specificminisubcategeories(_id: string):Observable<any>{
  return this.httpClient.get(URL+'subcategory/'+_id+'/specific_categories/')
}


getbydata(_id: string):Observable<any>{
  return this.httpClient.get(URL+'categoriesdata/'+_id)
}







}
