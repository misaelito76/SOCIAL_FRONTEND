import { Publication } from './../models/publication';
import { SummaryPipe } from './../summaryPipe';
import { Like } from './../models/like';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { Component, OnInit, DoCheck, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service';
import { GLOBAL } from '../services/global';
import { PublicationService } from '../services/publication.service';
import { UploadService } from '../services/upload.service';
import { FollowService } from './../services/follow.service';
import { Follow } from './../models/follow';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from '@angular/core/src/util';
import { LikeService } from '../services/like.service';
@Component({
	selector: 'app-publications',
	templateUrl: './publications.component.html',
	styleUrls: ['./publications.component.scss'],
})
export class PublicationsComponent implements OnInit, DoCheck {
	
	public likesCount: number;
	public isActive: boolean; 
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
	public maxLength: number
	public publication: Publication;
	public summary: SummaryPipe
	public likes;
	public liking;
	public liked;
	public _id
	constructor(
		private _publicationService: PublicationService,
		private _uploadService: UploadService,
		private _userService: UserService,
		private _followService: FollowService,
		private _route: ActivatedRoute,
		private _router: Router,
		private _likeService: LikeService,

	) {
		this.title = 'Publication';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.publication = new Publication("", "", "", "", this.identity._id);
		this.identity = this._userService.getIdentity();
		this.url = GLOBAL.url;
		this.stats = this._userService.getStats();
		this.identity = this._userService.getIdentity();
		this.liked = false;
		this.liking = false;
		this._id = this._publicationService.getIdentityPub();
	}


	selectedFile: File = null;
	onSelectFile(event: any) {
		this.selectedFile = <File>event.target.files[0]

	}
	
	


	ngOnInit() {
		this.url = GLOBAL.url
		this.identity = this._userService.getIdentity();
		this.getPublications()
		this.stats = this._userService.getStats()
		this.url = GLOBAL.url
		this.loadPage()
	
	}loadPage() {
		this._route.params.subscribe(params => {
			let id = params['id'];
			this.getCounters(id);
		});
	}
	getCounters(id) {
		this._userService.getCounters(id).subscribe(
			response => {
				this.likes = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	}
	



	reload(event) {
		this.getPublications()
	}
	public spinner = 'false';
	ngDoCheck() {
		this.identity = this._userService.getIdentity();//*DoCheck refresh screen after this change
	}
	getPublications() {
		this._publicationService.getPublications(this.token).subscribe(response => {
			//console.log(response.publication)
			if (response.publications) {
				this.spinner = 'true';
				this.total = response.total_items;
				this.itemsPerPage = response.items_per_page//paginaccion
				this.pages = response.pages
				this.totalPub = response.publications
				this.likes = response.users_liking;

				this.status = 'success';
			}
		}, error => {
			var errorMessage = <any>error;
			console.log(errorMessage);
			if (errorMessage != null) {
				this.status = 'error';
			}

		})
	}
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

							this.status = 'success';
							this.total = response.total_items
							//form.reset()
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
	LikePublication(liked) {
	
		let likesCount = new Like('', this.publication._id,liked);
		this.likesCount =0
		if(!this.isActive )this.likesCount += 1
		this.isActive = !this.isActive

		this._likeService.addLike(this.token,this.publication._id, likesCount).subscribe(
			response => {

				if (!response.like) {
					this.status = 'error';
				} else {
					this.status = 'success';
				
					localStorage.setItem('likes', JSON.stringify(response))
				}
			},
			error => {
				var errorMessage = <any>error;
				console.log(errorMessage);

				if (errorMessage != null) {
					this.status = 'error';
				}		console.log(this.likesCount);

			}
		);
	};
	getPublication(id) {
		this._publicationService.getPublication(id).subscribe(
			response => {
				if (response.publication) {
					this.publication = response.publication;
					console.log(this.publication)

					if (response.liking && response.liking._id
					) {
						this.liking = true;
					} else {
						this.liking = false;

					}
					if (response.liked && response.liked._id
						) {
						this.liked = true;
					} else {
						this.liked = false;

					}

				} else {
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
				//this._router.navigate(['/timeline', this.identity._id])

			}
		);
	}

	




}

