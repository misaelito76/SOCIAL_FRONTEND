import { Component, OnInit,DoCheck  } from '@angular/core';
import { UserService } from '../services/user.service'
import { Router,ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../services/global'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers:[UserService]
})
export class NavbarComponent implements OnInit, DoCheck {

  public title: string;
  public identity;
  public url:string
  constructor(
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _router:Router
  ) {
    
  }
  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.url =GLOBAL.url

    console.log(this.identity);
  }
  ngDoCheck() {
    this.identity = this._userService.getIdentity();//*DoCheck refresh screen after this change

  }
  logout() {
    localStorage.clear();
    this.identity = null;
    this._router.navigate(['/'])
  }

}
