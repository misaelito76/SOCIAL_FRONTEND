import { UserService } from './services/user.service';
import { UploadService } from './services/upload.service';
import { PublicationService } from './services/publication.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, Validators } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app/navbar/app-routing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule, } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { ScrollingModule } from '@angular/cdk/scrolling';

import {

  MatToolbarModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatProgressBarModule,
  MatCardModule,
  MatPaginatorModule,
  MatCheckboxModule,
  MatExpansionModule, MatGridListModule, MatMenuModule, MatTableModule, MatSortModule, MatAutocompleteModule, MatStepperModule,
} from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MaterialFileInputModule } from 'ngx-material-file-input';



import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { TimelineComponent } from './timeline/timeline.component';
import { PetsComponent } from './pets/pets.component';
import { RegisterComponent } from './register/register.component';
import { PetLostComponent } from './pet-lost/pet-lost.component';
import { LoginComponent } from './login/login.component';
import { AboutComponent } from './about/about.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { ProfileComponent } from './profile/profile.component';
import { FollowService } from './services/follow.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { LayoutModule } from '@angular/cdk/layout';
import { PublicationsComponent } from './publications/publications.component';
import { PostsComponent } from './posts/posts.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'timeline', component: TimelineComponent },
  { path: 'timeline/:page', component: TimelineComponent },
  { path: 'profile/:id', component: ProfileComponent },

  { path: 'pets', component: PetsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'edit-user', component: UserEditComponent },
  { path: 'about', component: AboutComponent },
  { path: 'pet-lost', component: PetLostComponent },
  { path: 'publications', component: PublicationsComponent },
  { path: 'posts', component: PostsComponent },
  { path: '**', component: NotfoundComponent }


]
@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    TimelineComponent,
    PetsComponent,
    RegisterComponent,
    PetLostComponent,
    LoginComponent,
    AboutComponent,
    UserEditComponent,
    NotfoundComponent,
    ProfileComponent,
    SidebarComponent,
    PublicationsComponent,
    PostsComponent,


  ],
  imports: [ScrollingModule,

    BrowserModule,
    MatProgressSpinnerModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'enabled'
    }),
    MatDividerModule,
    MatToolbarModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatTooltipModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatGridListModule,
    MatMenuModule,
    LayoutModule,
    MatTableModule,
    MatSortModule,
    MatStepperModule,
    MaterialFileInputModule

  ],
  providers: [UserService, UploadService, FollowService, PublicationService],
  exports: [MatInputModule, MatButtonModule, MatToolbarModule, MatDatepickerModule, MatCardModule,],

  bootstrap: [AppComponent]
})
export class AppModule { }
