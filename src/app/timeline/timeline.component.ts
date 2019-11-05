import { FollowService } from './../services/follow.service';
import { Follow } from './../models/follow';
import { Component, OnInit, DoCheck } from '@angular/core';
import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { UserService } from '../services/user.service'
import { GLOBAL } from '../services/global'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { User } from '../models/user';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
	selector: 'app-timeline',
	templateUrl: './timeline.component.html',
	styleUrls: ['./timeline.component.scss'],
	providers: [UserService, FollowService]
})
export class TimelineComponent implements OnInit, DoCheck {
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
	public itemsPerPage;
	public user: User;
	public follow;
	public following;
	public followed;

	constructor(
		private _userService: UserService,
		private _followService: FollowService,
		private _route: ActivatedRoute,
		private _router: Router,


	) {
		this.title = `Pet's world`;
		this._secondTitle = `Connections`
		this.token = this._userService.getToken();
		this.url = GLOBAL.url;
		this.stats = this._userService.getStats();
		this.identity = this._userService.getIdentity();
		this.followed = false;
		this.following = false;
		this.user = new User("", "", "", "", "", "", "ROLE_USER",
			"", "", "", "", "", "", "", "", "", "", "", "", "", "");

	}
	ngOnInit() {
		this.identity = this._userService.getIdentity();
		this.stats = this._userService.getStats()
		this.url = GLOBAL.url
		this.getUsers(this.page);
		this.loadPage();

	}

	

	loadPage() {
		this._route.params.subscribe(params => {
			let id = params['id'];

			this.getUser(id);
			this.getCounters(id);
		});
	}

	getUser(id) {
		this._userService.getUser(id).subscribe(
			response => {
				if (response.user) {
					console.log(response);
					this.user = response.user;
					if (response.following && response.following._id) {
						this.following = true
					} else {
						this.following = false
					}
					if (response.followed && response.followed._id) {
						this.followed = true
					} else {
						this.followed = false
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

	getCounters(id) {
		this._userService.getCounters(id).subscribe(
			response => {
				this.stats = response;
			},
			error => {
				console.log(<any>error);
			}
		);
	}


	// GET USERS
	public spinner = 'false';

	getUsers(page) {
		this._userService.getUsers(page).subscribe(
			response => {
				if (response.users) {
					this.spinner = 'true';
					this.status = 'success';
					this.total = response.total;
					this.pages = response.pages;
					this.follows = response.users_following;
					this.itemsPerPage = response.items_per_page
						this.users = response.users;

			


				} else {
					this.status = 'error';

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

}
