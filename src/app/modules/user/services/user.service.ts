import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { HelpersService } from 'shared/services/helpers.service';
import { UserModel } from 'auth/models/user.model';
import { UserResponse } from '../interfaces/user-response.interface';
import { GetParams } from 'shared/interfaces/get-params.interface';
import { ReponseErrorApi } from 'shared/interfaces/response.interface';


@Injectable( {
  providedIn: 'root'
} )
export class UserService {

  private urlApi = environment.apiUrl;

  constructor (
    private http: HttpClient,
    private helpers: HelpersService
  ) { }

  getMany ( getParams: GetParams<UserModel> ): Observable<UserResponse | undefined> {

    if ( !getParams.sort_c ) {
      getParams.sort_c = 'createdAt';
      getParams.sort_d = 'DESC';
    }

    const urlParams = this.helpers.buildUrlGetParams( getParams );
    const url = `${ this.urlApi }/user${ urlParams }`;

    return this.http.get<UserResponse>( url ).pipe(
      tap( res => res ),
      catchError( error => of( undefined ) )
    );

  }

  getOne ( getParams: GetParams<UserModel> ): Observable<UserModel | undefined> {

    const url = `${ this.urlApi }/user/${ getParams.id }`;

    return this.http.get<UserResponse>( url ).pipe(
      map( res => res.data as UserModel ),
      catchError( error => of( undefined ) )
    );

  }

  createOne ( getParams: GetParams<UserModel> ): Observable<UserModel | ReponseErrorApi> {

    const url = `${ this.urlApi }/user`;

    return this.http.post<UserResponse>( url, getParams.body ).pipe(
      map( res => res.data as UserModel ),
      catchError( error => of( error.error ) )
    );

  }

  editOne ( getParams: GetParams<UserModel> ): Observable<UserModel | ReponseErrorApi> {

    const url = `${ this.urlApi }/user/${ getParams.id }`;

    return this.http.put<UserResponse>( url, getParams.body ).pipe(
      map( res => res.data as UserModel ),
      catchError( error => of( error.error ) )
    );

  }

  deleteOne ( getParams: GetParams<UserModel> ): Observable<UserResponse | undefined> {

    const url = `${ this.urlApi }/user/${ getParams.id }`;

    return this.http.delete<UserResponse>( url ).pipe(
      tap( res => res ),
      catchError( error => of( undefined ) )
    );

  }


}
