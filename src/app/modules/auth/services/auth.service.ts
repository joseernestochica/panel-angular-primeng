import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, Subscription } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AuthModel } from '../models/auth.model';
import { UserModel } from '../models/user.model';
import { environment } from 'environments/environment';
import { AuthResponse } from '../interfaces/auth.interace';

@Injectable( {
  providedIn: 'root'
} )
export class AuthService {

  private urlApi = environment.apiUrl;
  private subscriptions: Subscription[] = [];
  private authLocalStorageToken: string = `${ environment.appVersion }-${ environment.USERDATA_KEY }`;

  currentUserSubject: BehaviorSubject<UserModel | undefined>;
  errorLogin$: BehaviorSubject<boolean>;

  get currentUserValue (): UserModel | undefined {
    return this.currentUserSubject.value;
  }

  set currentUserValue ( user: UserModel | undefined ) {
    this.currentUserSubject.next( user );
  }

  constructor (
    private router: Router,
    private http: HttpClient
  ) {

    this.currentUserSubject = new BehaviorSubject<UserModel | undefined>( undefined );
    this.errorLogin$ = new BehaviorSubject<boolean>( false );

    const subscr = this.getUserByToken().subscribe();
    this.subscriptions.push( subscr );

  }

  login ( email: string, password: string ): Observable<UserModel | undefined> {

    const body = { email, password };
    const url = `${ this.urlApi }/auth/login`;

    return this.http.post<AuthResponse>( url, body ).pipe(
      map( res => {
        console.log( 'res', res );
        if ( !res || !res.user ) { return undefined; }

        const user = res.user;

        const auth = new AuthModel();
        auth.token = res.token;
        auth.refreshToken = res.refreshToken;
        auth.user = user;

        this.setAuthFromLocalStorage( auth );
        return auth;

      } ),
      switchMap( () => this.getUserByToken() ),
      catchError( ( err ) => {
        console.error( 'ERRORRRRRRRRR !!!!!', err );
        console.error( 'err', err );
        return of( undefined );
      } )
    );

  }

  logout ( redir = false ) {

    const auth = this.getAuthFromLocalStorage();

    if ( auth ) {
      const url = `${ this.urlApi }/login/refresh_token`;
      const sb = this.http.delete( url, {
        headers: {
          'r-token': auth.refreshToken || '',
          'r-usuario': auth.user?.id?.toString() || ''
        }
      } ).subscribe();
      this.subscriptions.push( sb );
    }

    localStorage.removeItem( this.authLocalStorageToken );
    this.currentUserValue = undefined;

    if ( redir ) { this.router.navigate( [ '/auth/login' ] ); }

  }

  getUserByToken (): Observable<UserModel | undefined> {

    const auth = this.getAuthFromLocalStorage();
    if ( !auth || !auth.token ) {
      return of( undefined );
    }

    const url = `${ this.urlApi }/user-token`;
    return this.http.get<AuthResponse>( url ).pipe(

      map( res => {
        const user = res && res.user ? res.user : undefined;
        if ( !user ) {
          this.logout;
          return undefined;
        }

        this.currentUserSubject.next( user );

        return user;

      } ),
      catchError( error => of( undefined ) )

    );

  }

  validateToken (): Observable<boolean> {

    const auth = this.getAuthFromLocalStorage();
    if ( !auth ) return of( false );

    const url = `${ this.urlApi }/login/check-token`;

    return this.http.get<AuthResponse>( url ).pipe(
      map( res => {
        if ( res && res.statusCode === 200 ) { return true }
        else return false;
      } ),
      catchError( async ( err ) => false ),
    );

  }

  refreshToken (): Observable<AuthModel | undefined> {

    const auth = this.getAuthFromLocalStorage();
    if ( !auth || !auth.user ) return of( undefined );

    const url = `${ this.urlApi }/login/renew`;

    return this.http.post<AuthResponse>( url, null, {
      headers: {
        'r-token': auth.refreshToken || '',
        'r-user': auth.user.id?.toString() || ''
      }
    } ).pipe(
      map( res => {
        if ( !res || !res.user ) { return undefined; }
        const user = res.user;

        const newAuth = new AuthModel();
        newAuth.token = res.token;
        newAuth.refreshToken = res.refreshToken;
        newAuth.user = user;

        this.setAuthFromLocalStorage( newAuth );
        return newAuth;

      } ),
      catchError( ( err ) => {
        return of( undefined )
      } )
    );

  }

  getAuthFromLocalStorage (): AuthModel | undefined {

    const dataLocalStorage = localStorage.getItem( this.authLocalStorageToken );
    if ( !dataLocalStorage ) { return undefined; }

    const authData: AuthModel = JSON.parse( dataLocalStorage );
    return authData;

  }

  private setAuthFromLocalStorage ( auth: AuthModel ): boolean {

    if ( auth && auth.token ) {
      localStorage.setItem( this.authLocalStorageToken, JSON.stringify( auth ) );
      return true;
    }

    return false;

  }

  dispose () {
    this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
  }

}
