import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'auth/services/auth.service';
import { UserModel } from 'auth/models/user.model';

@Component( {
  selector: 'app-app-sidebar-profile',
  templateUrl: './app-sidebar-profile.component.html',
} )
export class AppSidebarProfileComponent {

  user$: Observable<UserModel | undefined>;

  constructor (
    private authService: AuthService,
    private router: Router,
  ) {
    this.user$ = this.authService.currentUserSubject.asObservable();
  }

  onEditInsertElement ( user: UserModel ) {

    if ( !user || !user.id ) { return; }

    this.router.navigateByUrl( `/user/edit/${ user.id }` );

  }

  logout () {

    this.authService.logout( true );

  }

}
