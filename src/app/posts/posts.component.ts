import { Publication } from './../models/publication';
import { GLOBAL } from './../services/global';
import { User } from './../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { PublicationService } from './../services/publication.service';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss']
})
export class PostsComponent implements OnInit {

  panelOpenState = false;
  public title: string;
  public identity;
  public url;
  public token;
  public page;
  public status;

  public pages;

  public total;

  public publications: Publication[]


  constructor(
    private _userService: UserService,
    private _publicationService: PublicationService,
    private _route: ActivatedRoute,
    private _router: Router,

  ) {
    this.title = `Posts`;
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.page = 1;

  }

  ngOnInit() {
  }
  etPublications(page) {
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.publications = response.publications;
          if (page > this.pages) {
            this._router.navigate(['/home'])
          }
        } else { this.status = 'error' }

      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = 'error'
        }
      }
    )
  }

}
