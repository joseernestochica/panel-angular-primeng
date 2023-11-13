import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from 'auth/services/auth.service';
import { ImageService } from 'shared/services/image.service';
import { LayoutService } from "./service/app.layout.service";
import { MenuItem } from 'primeng/api';

import { imgagesDefault } from 'environments/environment';
import { UserModel } from 'auth/models/user.model';

@Component( {
	selector: 'app-topbar',
	templateUrl: './app.topbar.component.html'
} )
export class AppTopBarComponent implements OnInit, OnDestroy {

	private subscriptions: Subscription[] = [];

	displaySidebarProfile = false;
	imgProfile: string = imgagesDefault.profile;
	items!: MenuItem[];

	@ViewChild( 'menubutton' ) menuButton!: ElementRef;
	@ViewChild( 'topbarmenubutton' ) topbarMenuButton!: ElementRef;
	@ViewChild( 'topbarmenu' ) menu!: ElementRef;

	constructor (
		private authService: AuthService,
		private imageService: ImageService,
		public layoutService: LayoutService,
	) { }

	ngOnInit (): void {

		const sb = this.authService.currentUserSubject.subscribe( user => {
			if ( !user ) { return; }

			this.setImageProfile( user );

		} );
		this.subscriptions.push( sb );

	}

	private setImageProfile ( user: UserModel ): void {

		if ( !user || !user.img || user.img === '' ) { return; }

		this.imgProfile = this.imageService.getImage( { name: user.img, type: 'imageUser', id: `${ user.id }` } );

	}

	ngOnDestroy () {
		this.subscriptions.forEach( sb => sb.unsubscribe() );
	}

}
