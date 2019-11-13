import { LikeService } from './../services/like.service';
import { Component, OnInit, DoCheck } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { Follow } from '../models/follow';
import { UserService } from '../services/user.service';
import { FollowService } from '../services/follow.service';
import { GLOBAL } from '../services/global';
import { PublicationService } from '../services/publication.service';
import { UploadService } from '../services/upload.service';
import { Publication } from '../models/publication';

@Component({
	selector: 'app-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit,DoCheck {
	public title: string;
	public user: User;
	public status: string;
	public identity;
	public token;
	public stats;
	public url;
	public follow;
	public following;
	public followed;
	public like;
	public liked;
	public publication: Publication;
	public total;
	public page;

	constructor(
		private _route: ActivatedRoute,
		private _router: Router,
		private _userService: UserService,
		private _followService: FollowService,
        private _likeService : LikeService,
		private _publicationService: PublicationService,
		private _uploadService: UploadService,
	) {
		this.title = 'Profile';
		this.identity = this._userService.getIdentity();
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.followed = false;
		this.following = false;
		this.like = false;
		this.liked = false;
		this.stats = this._userService.getStats()
		this.user = new User("", "", "", "", "", "", "ROLE_USER",
			"", "", "", "", "", "", "", "", "", "", "", "", "", "");
		this.publication = new Publication("", "", "", "", this.user._id);
		this.page = 1;


	}



	ngOnInit() {
		this.identity = this._userService.getIdentity();
        this.getUser();
		this.getCounters();	}

	

	getUser() {
		this._userService.getUser(this.identity._id).subscribe(
			response => {
				if (response.user) {
					console.log(response);
					this.user = response.user;
					if (response.following && response.following._id
					) {
						this.following = true;
						this.like =true
					} else {
						this.following = false;
						this.like =false

					}
					if (response.followed && response.followed._id
					&&response.liked &&response.liked._id) {
						this.followed = true;
						this.liked =true

					} else {
						this.followed = false;
						this.like =false

					}

				} else {
					this.status = 'error';
				}
			},
			error => {
				console.log(<any>error);
				//this._router.navigate(['/profile', this.identity._id])

			}
		);
	}

	getCounters() {
		this._userService.getCounters(this.identity._id).subscribe(
			response => {
				this.stats = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	}
	selectedFile: File = null;
	onSelectFile(event: any) {
		this.selectedFile = <File>event.target.files[0]

	}
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
		ngDoCheck() {
		this.identity = this._userService.getIdentity();//*DoCheck refresh screen after this change

	}

}
