
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { Publication } from '../models/publication'
import { PublicationService } from '../services/publication.service';
import { UploadService } from '../services/upload.service';
import { FollowService } from './../services/follow.service';
import { Follow } from './../models/follow';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-publications',
	templateUrl: './publications.component.html',
	styleUrls: ['./publications.component.scss'],
})
export class PublicationsComponent implements OnInit, DoCheck {
	panelOpenState = false;
	public title: string;
	public _secondTitle: string
	public identity;
	public url;
	public token;
	public page;
	public pages;
	public users: User[];
	public total;
	public next_page;
	public prev_page;
	public status;
	public follows;
	public stats;
	public user: User;
    public itemsPerPage;
	public totalPub: Publication[];
	public publication: Publication;

	constructor(
		private _publicationService: PublicationService,
		private _uploadService: UploadService,
		private _userService: UserService,
		private _followService: FollowService,

		private _route: ActivatedRoute,
		private _router: Router,
	) {
		this.title = 'Publication';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.publication = new Publication("", "", "", "", this.identity._id);
		this.page = 1;
		this.identity = this._userService.getIdentity();
		this.stats = this._userService.getStats()
		this.url = GLOBAL.url

	}
	selectedFile: File = null;
	onSelectFile(event: any) {
		this.selectedFile = <File>event.target.files[0]

	}


	ngOnInit() {

		this.actualPage();
		this.url = GLOBAL.url

		this.identity = this._userService.getIdentity();

	}
	actualPage() {
		this._route.params.subscribe(params => {
			let page = +params['page'];
			this.page = page;

			if (!params['page']) {
				page = 1;
			}

			if (!page) {
				page = 1;
			} else {
				this.next_page = page + 1;
				this.prev_page = page - 1;

				if (this.prev_page <= 0) {
					this.prev_page = 1;
				}
			}

			this.getUsers(page);
			this.getPublications(this.page)

		});
	}
	public spinner = 'false';

	getUsers(page) {
		this._userService.getUsers(page).subscribe(
			response => {
				//console.log(response.users)
				if (!response.users) {
					this.status = 'error';
				} else {
					this.spinner = 'true';
					this.total = response.total;
					this.users = response.users;
					this.pages = response.pages;
					this.follows = response.users_following;
					console.log(this.users);

					/*if (page > this.pages) {
						this._router.navigate(['/gente', 1]);
					}*/
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if (errorMessage != null) {
					this.status = 'error';
				}
			}
		);
	}

	public followUserOver;
	mouseEnter(user_id) {
		this.followUserOver = user_id;
	}

	mouseLeave(user_id) {
		this.followUserOver = 0;
	}

	followUser(followed) {
		var follow = new Follow('', this.identity._id, followed);

		this._followService.addFollow(this.token, follow).subscribe(
			response => {
				if (!response.follow) {
					this.status = 'error';
				} else {
					this.status = 'success';
					this.follows.push(followed);
					localStorage.setItem('stats', JSON.stringify(response))
				}
				//localStorage.setItem('stats', JSON.stringify(response));

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if (errorMessage != null) {
					this.status = 'error';
				}
			}
		);
	}

		
	unfollowUser(followed) {
		this._followService.deleteFollow(this.token, followed).subscribe(
			response => {
				var search = this.follows.indexOf(followed);
				if (search != -1) {
					this.follows.splice(search, 1);
					localStorage.removeItem('stats');
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if (errorMessage != null) {
					this.status = 'error';
				}
			}
		);
	}


	ngDoCheck() {
		this.identity = this._userService.getIdentity();//*DoCheck refresh screen after this change

	}


	getPublications(page,adding=false) {
		this._publicationService.getPublications(this.token, page).subscribe(response => {
			console.log(response)
			if (response.Publications) {
			   this.spinner = 'true';
			   this.total=response.Total_items;
			   this.itemsPerPage=response.items_per_page//paginaccion
				this.pages = response.Pages
				if (!adding) {
				this.totalPub = response.Publications
				
			} else{	var arrA=this.totalPub//paginaccion
                    var arrB=response.Publications//paginaccion
					this.totalPub=arrA.concat(arrB)//paginaccion
					//p
				
			}
			}
		}, error => {
			var errorMessage = <any>error;
			console.log(errorMessage);
			if (errorMessage != null) {
				this.status = 'error';
			}

		})
	}
		public noMore= false;//pagination
		viewMore(){
			if(this.totalPub.length==(this.pages)){
this.noMore=true
			}else{
				this.page+=1
			}
			this.getPublications(this.page,true)
		}//pagination


	//Upload select file;
	public filesToUpload: Array<File>;
	fileChangeEvent(fileInput: any) {
		this.filesToUpload = <Array<File>>fileInput.target.files;
		console.log(this.filesToUpload)
	}

	onSubmit(form) {
		this._publicationService.addPublication(this.token, this.publication).subscribe(
			response => {
				if (response.publication) {

						this._uploadService.makeFileRequest(this.url +
						'upload-image-pub/' + response.publication._id, [], this.filesToUpload, this.token, 'image')
						.then((result: any) => {
							this.publication.file = result.image;
																		                             form.reset()

							this.status = 'success';
							this.total = response.total_items

						})

				}
		
				else {
				
					this.status = 'error'


				}

			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);
				if (errorMessage != null) {
					this.status = 'error';
				}

			}
		)


	}
	

}

