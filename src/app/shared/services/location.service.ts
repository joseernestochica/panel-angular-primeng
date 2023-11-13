import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { of, Observable, Subscription } from 'rxjs';
import { environment } from 'environments/environment';
import { ICountryModel, LocationModel } from 'shared/models';
import { ResponseLocation, GetLocationParams } from 'shared/interfaces';

@Injectable( {
  providedIn: 'root'
} )
export class LocationService {

  private subscriptions: Subscription[] = [];
  private urlApi = environment.apiUrl;

  constructor (
    private http: HttpClient
  ) { }

  async getAllCountries ( params: GetLocationParams ): Promise<ICountryModel[] | undefined> {

    return new Promise( response => {

      const url = `${ this.urlApi }/countries?lang=${ params.lang || 'es' }`;

      const sb = this.http.get<ResponseLocation>( url ).pipe(
        map( res => res.countries ),
        catchError( err => of( undefined ) )
      ).subscribe( countries => {
        if ( countries && countries.length > 0 ) { response( countries ) }
        else { response( undefined ); }
      } );
      this.subscriptions.push( sb );

    } );

  }


  async getStatesbyCountry ( params: GetLocationParams ): Promise<LocationModel[] | undefined> {

    return new Promise( response => {

      const url = `${ this.urlApi }/states?country_iso=${ params.country_iso || 'es' }`;

      const sb = this.http.get<ResponseLocation>( url ).pipe(
        map( res => res.states ),
        catchError( err => of( undefined ) )
      ).subscribe( states => {
        if ( states && states.length > 0 ) { response( states ); }
        else { response( undefined ); }
      } );
      this.subscriptions.push( sb );

    } );

  }

  async getCitiesByCountryAndState ( params: GetLocationParams ): Promise<LocationModel[] | undefined> {

    return new Promise( response => {

      const url = `${ this.urlApi }/cities?country_iso=${ params.country_iso || 'es' }&state_id=${ params.state_id || 23 }`;

      const sb = this.http.get<ResponseLocation>( url ).pipe(
        map( res => res.cities ),
        catchError( err => of( undefined ) )
      ).subscribe( cities => {
        if ( cities && cities.length > 0 ) { response( cities ) }
        else { response( undefined ); }
      } );
      this.subscriptions.push( sb );

    } );

  }

  async getCountryByCode ( params: GetLocationParams ): Promise<string | undefined> {

    return new Promise( response => {

      const url = `${ this.urlApi }/country?country_iso=${ params.country_iso || 'es' }`;

      const sb = this.http.get<ResponseLocation>( url ).pipe(
        map( res => res.country ),
        catchError( err => of( undefined ) )
      ).subscribe( country => response( country ) );
      this.subscriptions.push( sb );

    } );

  }

  async getStatebyCode ( params: GetLocationParams ): Promise<string | undefined> {

    return new Promise( response => {

      const url = `${ this.urlApi }/state?country_iso=${ params.country_iso || 'es' }&state_id=${ params.state_id || '23' }`;

      const sb = this.http.get<ResponseLocation>( url ).pipe(
        map( res => res.state ),
        catchError( err => of( undefined ) )
      ).subscribe( state => response( state ) );
      this.subscriptions.push( sb );

    } );


  }

  async getCitybyCode ( params: GetLocationParams ): Promise<string | undefined> {

    return new Promise( response => {

      const url = `${ this.urlApi }/city?country_iso=${ params.country_iso || 'es' }&state_id=${ params.state_id || '23' }&city_id=${ params.city_id || 'jaen' }`;

      const sb = this.http.get<ResponseLocation>( url ).pipe(
        map( res => res.city ),
        catchError( err => of( undefined ) )
      ).subscribe( city => response( city ) );
      this.subscriptions.push( sb );

    } );

  }

  dispose () {
    this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
  }

}
