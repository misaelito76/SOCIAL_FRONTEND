
import { Publication } from './../models/publication';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { GLOBAL } from './global';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class PublicationService {
  public url: string;
  constructor(
    private _http: HttpClient
  ) { 
    this.url = GLOBAL.url;
  }
	addPublication(token, publication):Observable<any>{
		let params = JSON.stringify(publication);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

	 	return this._http.post(this.url+'publication/', params, {headers: headers});
	}
	


  getPublications(token, page = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

						  
		
		return this._http.get(this.url +'publications/'+ page, {headers: headers});
	} 
   deletePublications(token, id ):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

						  
		
		return this._http.delete(this.url +'publication/:'+ id, {headers: headers});
	} 


	
}

