import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class AuthGuardAuthor  {

	constructor (
		private authService: AuthService,
		private router: Router
	) { }

	canActivate ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {

		const currentUser = this.authService.currentUserValue;
		if ( !currentUser ) { this.authService.logout( true ); return false; }

		const found = currentUser.roles?.find( role => role === 'AUTHOR' );
		if ( !found ) {
			this.router.navigateByUrl( '/auth/access' );
			return false;
		}

		return true;

	}

}
