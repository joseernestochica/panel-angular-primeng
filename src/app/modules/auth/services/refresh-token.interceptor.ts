import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

	private isRefreshing = false;
	private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>( null );

	constructor (
		private injector: Injector,
		private router: Router
	) { }

	intercept ( request: HttpRequest<any>, next: HttpHandler ): Observable<HttpEvent<any>> {

		const authService = this.injector.get<AuthService>( AuthService );

		if ( authService.getAuthFromLocalStorage() ) {
			const authData = authService.getAuthFromLocalStorage();
			request = this.addToken( request, authData?.accessToken || '' );
		}

		return next.handle( request ).pipe(
			catchError( ( error: any ) => {
				if ( error instanceof HttpErrorResponse && error.status === 401 ) {

					// Error en el login
					const errorMessage: string | undefined = error.error?.message;
					if ( errorMessage === 'login incorrect' ) {
						authService.errorLogin$.next( true );
						authService.logout();
						return of( error );
					}

					// Refrescar el token
					console.info( 'Refresh token' );
					return this.handle401Error( request, next );

				} else {

					console.warn( 'Error en petición http' );
					console.warn( 'Crear un servicio para guardar los errores en DB' );
					console.warn( error );
					throw error;
					return of( error );

				}
			} ) );

	}

	// ==============================================================
	// Método para añadir el token
	// ==============================================================
	private addToken ( request: HttpRequest<any>, token: string ) {

		return request.clone( {
			setHeaders: {
				'Authorization': `Bearer ${ token }`
			}
		} );

	}

	// ==============================================================
	// Método para interceptar el tipo de error y enviar el refresh
	// ==============================================================
	private handle401Error ( request: HttpRequest<any>, next: HttpHandler ) {

		const authService = this.injector.get<AuthService>( AuthService );

		if ( !this.isRefreshing ) {

			this.isRefreshing = true;
			this.refreshTokenSubject.next( null );

			return authService.refreshToken()
				.pipe(
					switchMap( newAuth => {

						this.isRefreshing = false;
						this.refreshTokenSubject.next( newAuth?.accessToken );
						return next.handle( this.addToken( request, newAuth?.accessToken || '' ) );

					} ),
					catchError( err => {
						authService.logout();
						return of( undefined )
					} ) );

		} else {

			return this.refreshTokenSubject.pipe(
				filter( token => token != null ),
				take( 1 ),
				switchMap( jwt => {
					return next.handle( this.addToken( request, jwt ) );
				} ),
				catchError( err => {
					return of( undefined )
				} ) );
		}

	}

}
