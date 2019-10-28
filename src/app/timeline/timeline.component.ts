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
		this.stats = this._userService.getStats()

	}
	ngOnInit() {
		this.identity = this._userService.getIdentity();
		this.stats = this._userService.getStats()
		this.url = GLOBAL.url
			this.getUsers(this.page);
		//console.log(this.identity);
		//console.log('timeline is loading');

	}
	

	// GET USERS
	public spinner = 'false';

	getUsers(page,adding=false) {//paginaccion
		this._userService.getUsers( page).subscribe(
			response => {
				//console.log(response.users)
				if (response.users) {
						this.spinner = 'true';
					this.total = response.total;
					this.pages = response.pages;
					this.follows = response.users_following;
					this.itemsPerPage=response.items_per_page//paginaccion

					if(!adding){//paginaccion
					this.users = response.users;//paginaccion

					}else{//paginaccion
					var arrA=this.users//paginaccion
                    var arrB=response.users//paginaccion
					this.users=arrA.concat(arrB)//paginaccion
					}//paginaccion

					
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
		public noMore= false;//pagination
		viewMore(){
			if(this.users.length==(this.total-this.itemsPerPage)){
this.noMore=true
			}else{
				this.page+=1
			}
			this.getUsers(this.page,true)
		}//pagination


	ngDoCheck() {
		this.identity = this._userService.getIdentity();//*DoCheck refresh screen after this change

	}

}
