import { UploadService } from "./../services/upload.service";
import { MatButtonModule, MatCheckboxModule } from "@angular/material";
import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../models/user";
import { Follow } from "../models/follow";
import { UserService } from "../services/user.service";
import { FollowService } from "../services/follow.service";
import { GLOBAL } from "../services/global";
import { Publication } from "../models/publication";
import { PublicationService } from "../services/publication.service";

@Component({
  selector: "app-publications",
  templateUrl: "./publications.component.html",
  styleUrls: ["./publications.component.scss"],
  providers: [UserService, PublicationService]
})
export class PublicationsComponent implements OnInit {
  public title: string;
  @Input() user: string;
  public status: string;
  public identity;
  public token;
  public url;
  public page;
  public publications: Publication[];
  public publication: Publication;
  public total;
  public pages;
  public itemsPerPage;
  public users: User[];
  public follows;

  constructor(
    private _uploadService: UploadService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _followService: FollowService,
    private _publicationService: PublicationService
  ) {
    this.title = "Publication";
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.publication = new Publication("", "", "", "", "", this.identity._id);
    this.page = 1;
  }

  ngOnInit() {
    console.log(this.publication.text);
    console.log(this.publications);

    this.getPublications(this.user, this.page);
  }

  onSubmit(form) {
    this._publicationService
      .addPublication(this.token, this.publication)
      .subscribe(
        response => {
          if (response.publication) {
            //this.publication =response.publication;
            //this._uploadService.makeFileRequest(this.url+'upload-image-pub/' + response.publication._id, [], this.filesToUpload,this.token,'image')
            //.then((result: any) => {
            this.status = "success";
            //this.publication.file = result.image;
            form.reset();
            //})
          } else {
            this.status = "error";
          }
        },
        error => {
          var errorMessage = <any>error;
          console.log(errorMessage);
          if (errorMessage != null) {
            this.status = "error";
          }
        }
      );
  }
  //Preview Logo
  /*urlPreview = '';
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.urlPreview = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }

  }*/

  //Upload select file
  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }
  getPublications(user, page, adding = false) {
    this._publicationService.getPublications(this.token, page).subscribe(
      response => {
        if (response.publications) {
          this.total = response.total_items;
          this.pages = response.pages;
          this.itemsPerPage = response.items_per_page;

          if (!adding) {
            this.publications = response.publications;
          } else {
            var arrayA = this.publications;
            var arrayB = response.publications;
            this.publications = arrayA.concat(arrayB);

            $("html, body").animate(
              { scrollTop: $("html").prop("scrollHeight") },
              500
            );
          }

          if (page > this.pages) {
            //this._router.navigate(['/home']);
          }
        } else {
          this.status = "error";
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);
        if (errorMessage != null) {
          this.status = "error";
        }
      }
    );
  }
  public noMore = false;
  viewMore() {
    this.page += 1;

    if (this.page == this.pages) {
      this.noMore = true;
    }

    this.getPublications(this.user, this.page, true);
  }
  public spinner = "false";

  getUsers(page) {
    this._userService.getUsers(page).subscribe(
      response => {
        console.log(response.users);
        if (!response.users) {
          this.status = "error";
        } else {
          this.total = response.total;
          this.users = response.users;
          this.pages = response.pages;
          this.spinner = "true";
          this.follows = response.users_following;

          if (page > this.pages) {
            this._router.navigate(["/", 1]);
          }
        }
      },
      error => {
        var errorMessage = <any>error;
        console.log(errorMessage);

        if (errorMessage != null) {
          this.status = "error";
        }
      }
    );
  }
  ngDoCheck() {
    this.identity = this._userService.getIdentity(); //*DoCheck refresh screen after this change
  }
}
