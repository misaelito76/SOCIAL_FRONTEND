
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
		this.identity = this._userService.getIdentity();
		this.url = GLOBAL.url

	}
	selectedFile: File = null;
	onSelectFile(event: any) {
		this.selectedFile = <File>event.target.files[0]

	}


	ngOnInit() {

		this.url = GLOBAL.url

		this.identity = this._userService.getIdentity();
		this.getPublications()

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
			console.log(response)
			if (response.Publications) {
				this.spinner = 'true';
				this.total = response.Total_items;
				this.itemsPerPage = response.items_per_page//paginaccion
				this.pages = response.Pages
				this.totalPub = response.Publications
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


}

