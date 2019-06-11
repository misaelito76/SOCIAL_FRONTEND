
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { Follow } from '../models/follow';
import { UserService } from '../services/user.service';
import { FollowService } from '../services/follow.service';
import { GLOBAL } from '../services/global';
import{Publication} from '../models/publication'
import { PublicationService } from '../services/publication.service';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss'],
})
export class PublicationsComponent implements OnInit {
	public title: string;
	public user: User;
	public status: string;
	public identity;
	public token;
	public url;
	public page;
public publications: Publication[];
public publication: Publication;
public total;
public pages
	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService,
		private _publicationService :PublicationService
	) {
		this.title = 'Publication';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
    this.publication = new Publication("","","","",this.identity._id);
this.page=1;

	}

	

	ngOnInit() {
    console.log(this.publication.text);
		this.getPublications(this.page)
		console.log(this.publications)
	}

  onSubmit(form){
		this._publicationService.addPublication(this.token,this.publication).subscribe(
			response=>{
if(response.publication){
//this.publication =response.publication;
this.status='success';
form.reset();
}else{
	this.status='error'
}
			},
			error =>{
				var errorMessage=<any>error;
				    console.log(errorMessage);
						if(errorMessage !=null){
							this.status='error';
						}

			}
		)
  }
	//Preview Logo
  urlPreview = '';
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.urlPreview = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }

  }

  //Upload select file
  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
getPublications(page){
	this._publicationService.getPublications(this.token,page).subscribe(
		response=>{			
			if(response.publications){
				this.total =response.total_items;
				this.pages =response.pages;
				this.publications=response.publications;
				if(page > this.pages){
					this._router.navigate(['/home'])
				}
			}else {this.status='error'}

		},
		error=>{
			var errorMessage =<any>error;
			console.log(errorMessage);
			if(errorMessage!=null){
				this.status = 'error'
			}
		}
	)
}

}

