import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { User } from '../models/user';
import { UserService } from '../services/user.service'
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  providers:[UserService]
})
export class RegisterComponent implements OnInit {
  centered = true;
  public title: string;
  public user: User;
  public status: string;
 
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
   thirdFormGroup: FormGroup;
    fourthFormGroup: FormGroup;
     fifthFormGroup: FormGroup;
  constructor(
    private _formBuilder: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService:UserService
  ) { 
    this.title = 'Register';
    this.user = new User(
      "", "", "", "",
      "", "", "ROLE_USER", ""
    );
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
       this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.required]
    });
       this.fourthFormGroup = this._formBuilder.group({
      fourthCtrl: ['', Validators.required]
    });
       this.fifthFormGroup = this._formBuilder.group({
      fifthCtrl: ['', Validators.required]
    });
  }
  onSubmit() {//*this is going to call the service

    this._userService.register(this.user).subscribe(response => {
      if (response.user && response.user._id) {
        console.log(response.user);

        this.status = 'success';
      } else {
        this.status = 'error'

      }
    },
      error => {
        console.log(<any>error)
      });
    this._router.navigate(['login'])

  }
  //Preview Logo
  urlPreview = '';
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.onload = (event: any) => {
        this.urlPreview = event.target.result;
      }

      reader.readAsDataURL(event.target.files[0]);
    }

  }

  //Upload select file
  public filesToUpload: Array<File>;
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

}