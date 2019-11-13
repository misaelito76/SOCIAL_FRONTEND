import { Like } from './../models/like';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { GLOBAL } from './global';


@Injectable({
  providedIn: 'root'
})
export class LikeService {
  public url: string;
  constructor(
    private _http: HttpClient
  ) { 
    this.url = GLOBAL.url;
  }
	addLike(token,pubId, like):Observable<any>{
		let params = JSON.stringify(like);
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token,);

	 	return this._http.post(this.url+'like', params, {headers: headers});
	}

	deleteLike(token, id):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.delete(this.url+'like/'+id, {headers: headers});
	}

	getLiking(token, pubId = null, page = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		var url = this.url+'liking';					 
		if(pubId != null){
			url = this.url+'liking/'+pubId+'/'+page;
		}							  
		
		return this._http.get(url, {headers: headers});
	}

	getLiked(token, userId = null, page = 1):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		var url = this.url+'liked';					 
		if(userId != null){
			url = this.url+'liked/'+userId+'/'+page;
		}							  
		
		return this._http.get(url, {headers: headers});
	}

	getMyLikes(token):Observable<any>{
		let headers = new HttpHeaders().set('Content-Type', 'application/json')
									   .set('Authorization', token);

		return this._http.get(this.url+'get-my-likes/true', {headers: headers});
	}
	
}

