import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class AuthGuard  {

	constructor (
		private authService: AuthService,
		private router: Router
	) { }

	canActivate ( route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): boolean {

		const currentUser = this.authService.currentUserValue;
		if ( currentUser ) { return true; } // Login correcto

		this.authService.logout( true );
		return false;

	}

}
