
import { Component, OnInit } from '@angular/core';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import { UserService } from '../services/user.service'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
 
@Component({
  selector: 'app-pets',
  templateUrl: './pets.component.html',
  styleUrls: ['./pets.component.scss'],
  providers:[UserService]
})
export class PetsComponent implements OnInit {
public title:string
  public identity;
  public token;
  public user: User;
  public status: string;
constructor(
  private _route: ActivatedRoute,
  private _router: Router,
  private _petsService:UserService
) {
  this.title = `Pet's corner`;
  this.user = this._petsService.getIdentity();
  this.identity = this.user;
  this.token = this._petsService.getToken();

}
  ngOnInit() {
  
    this.identity = this._petsService.getIdentity();
   
    
  console.log(this.identity);
}
ngDoCheck() {
  //* this.identity = this._userService.getIdentity();//*DoCheck refresh screen after this change
  
}




}




