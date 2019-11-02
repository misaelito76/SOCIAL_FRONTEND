import { User } from './../models/user';
import { Component, OnInit, DoCheck } from '@angular/core';
import{UserService} from '../services/user.service'
import { UploadService } from '../services/upload.service';
import { GLOBAL } from '../services/global'
import { Router,ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers:[UserService],
  
})
export class HomeComponent implements OnInit,DoCheck {
  public title:string
  public identity;
  public url:string;
  public token;
  public user:User[]
constructor(
  private _userService: UserService,
  private _uploadService:UploadService,
  
  private  _route: ActivatedRoute,
  private _router:Router
) {
  
}
  ngOnInit() {
  this.title = `Pet's world`
    this.identity = this._userService.getIdentity();
    this.url =GLOBAL.url;
    this.token = this._userService.getToken()
  console.log(this.identity);
}
ngDoCheck() {
  this.identity = this._userService.getIdentity();//*DoCheck refresh screen after this change

}

}
