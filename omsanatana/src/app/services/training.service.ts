import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';
import { URL1 } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private httpClient: HttpClient) { }





  getTrainingCategories():Observable<any>{
    return this.httpClient.get(URL1+"trainingcategory")   
    
  }


  getTrainings(categoryId: string,locationId: string): Observable<any> {
    return this.httpClient.get(URL1+"locationByTraining",{
          params: {
            category: categoryId,
            input_value: locationId,
            
          }
        });
      }



      getalltrainings():Observable<any>{
        return this.httpClient.get(URL1+"training")
      }



      trainingCategorydata(_id: string):Observable<any>{
        return this.httpClient.get(URL1+'trainingcategory/'+_id)
 
      }

      getTrainingById(_id: string):Observable<any>{
        return this.httpClient.get(URL1+'training/'+_id)
 
      }

      addtraining(training: any): Observable<any> {
        return this.httpClient.post(URL1+"training", training);
      }


      
      gettrainingsubCategories():Observable<any>{
        return this.httpClient.get(URL1+"trainingsubcategory")   
      }


      traininggetById(_id: string):Observable<any>{
        return this.httpClient.get(URL1+'trainingsubcategory/'+_id)
 
      }





      getContinents():Observable<any>{
        return this.httpClient.get(URL1+"continents")   
      }
    
      getCountries(_id: string): Observable<any[]> {
        return this.httpClient.get<any[]>(URL1+"get-countriesBycontinent/"+_id);
      }
    
      getStates(_id: string): Observable<any[]> {
        return this.httpClient.get<any[]>(URL1+"states_by_country/"+_id);
      }
    
      getDistricts(_id: string): Observable<any[]> {
        return this.httpClient.get<any[]>(URL1+"districts_by_state/"+_id);
      }
}
