import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';

import { AuthService } from 'auth/services/auth.service';
import { ImageService } from 'shared/services/image.service';

import { imgagesDefault } from 'environments/environment';
import { UserModel } from 'auth/models/user.model';

@Component( {
  selector: 'app-app-sidebar-profile',
  templateUrl: './app-sidebar-profile.component.html',
} )
export class AppSidebarProfileComponent implements OnInit, OnDestroy {

  private subscriptions: Subscription[] = [];
  private user: UserModel | undefined;

  user$: Observable<UserModel | undefined>;
  imgProfile: string = imgagesDefault.profile;

  constructor (
    private authService: AuthService,
    private imageService: ImageService,
    private router: Router,
  ) {
    this.user$ = this.authService.currentUserSubject.asObservable();
  }

  ngOnInit (): void {

    this.user = this.authService.currentUserValue;
    this.setImageProfile();

  }

  private setImageProfile (): void {

    if ( !this.user || !this.user.img || this.user.img === '' ) { return; }

    this.imgProfile = this.imageService.getImage( { name: this.user.img, type: 'imageUser', id: `${ this.user.id }` } );

  }

  onFileSelected ( event: any ) {

    if ( !this.user || !this.user.img ) return;

    const file: File = event.target.files[ 0 ];
    if ( !file || file.type.search( 'image' ) === -1 ) { return; }

    const imgUrlPic = `?[TYPE]=imageUser&user=${ this.user?.id }`;

    const sb = this.imageService.insertImagePic( { imagesPic: [ file ], urlImg: imgUrlPic } ).subscribe( res => {
      if ( !res || !res.images || !this.user ) { return; }

      this.user.img = res.images[ 0 ];
      this.authService.currentUserSubject.next( this.user );
      this.setImageProfile();

    } );
    this.subscriptions.push( sb );

  }

  onEditInsertElement ( user: UserModel ) {

    if ( !user || !user.id ) { return; }

    this.router.navigateByUrl( `/user/edit/${ user.id }` );

  }

  logout () {

    this.authService.logout( true );

  }

  ngOnDestroy () {
    this.subscriptions.forEach( sb => sb.unsubscribe() );
  }

}
