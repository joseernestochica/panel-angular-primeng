import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable( {
	providedIn: 'root'
} )
export class AuthGuard implements CanActivate {

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
