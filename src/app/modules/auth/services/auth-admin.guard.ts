import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class AuthGuardAdmin  {

	constructor (
		private authService: AuthService,
		private router: Router
	) { }

	canActivate ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {

		const currentUser = this.authService.currentUserValue;
		if ( !currentUser ) { this.authService.logout( true ); return false; }

		const found = currentUser.roles?.find( role => role === 'ADMIN' );
		if ( !found ) {
			this.router.navigateByUrl( '/auth/access' );
			return false;
		}

		return true;

	}

}
