import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { User } from "../models/user";
import { UserService } from "../services/user.service";

@Component({
  selector: "login",
  templateUrl: "./login.component.html",
  providers: [UserService]
})
export class LoginComponent implements OnInit {
  public title: string;
  public user: User;
  public status: string;
  public identity;
  public token;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService
  ) {
    this.title = "Sign in";
    this.user = new User("", "", "", "", "", "", "ROLE_USER", "");
  }

  ngOnInit() {
    console.log("Componente de login cargado...");
  }

  onSubmit(loginForm) {
    // loguear al usuario y conseguir sus datos
    this._userService.signUp(this.user).subscribe(
      response => {
        this.identity = response.user;

        console.log(this.identity);

        if (!this.identity || !this.identity._id) {
          this.status = "error";
        } else {
          // PERSISTIR DATOS DEL USUARIO
          localStorage.setItem("identity", JSON.stringify(this.identity));

          // Conseguir el token
          this.getToken();
          loginForm.reset();
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

  getToken() {
    this._userService.signUp(this.user, "true").subscribe(
      response => {
        this.token = response.token;

        console.log(this.token);

        if (this.token.length <= 0) {
          this.status = "error";
        } else {
          // PERSISTIR TOKEN DEL USUARIO
          localStorage.setItem("token", this.token);
          this._router.navigate(["timeline"]);
          // Conseguir los contadores o estadisticas del usuario
          //this.getCounters();
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

  getCounters() {
    this._userService.getCounters().subscribe(
      response => {
        localStorage.setItem("stats", JSON.stringify(response));
        this.status = "success";
      },
      error => {
        console.log(<any>error);
      }
    );
  }

  ngDoCheck() {
    this.identity = this._userService.getIdentity(); //*DoCheck refresh screen after this change
  }
}
