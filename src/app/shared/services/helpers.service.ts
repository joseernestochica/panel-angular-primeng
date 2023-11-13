import { Injectable } from '@angular/core';
import { GetParams } from 'shared/interfaces/get-params.interface';

@Injectable( {
  providedIn: 'root'
} )
export class HelpersService {

  constructor () { }

  arrayToParamsGetSelect ( arrayString: string[] | undefined ): string {

    if ( !arrayString || arrayString.length === 0 ) { return ''; }
    return arrayString.map( text => text.trim() ).join( '|' );

  }

  buildUrlGetParams<T> ( getParams: GetParams<T> ): string {

    const params: string[] = [];

    if ( getParams.limit ) { params.push( `limit=${ getParams.limit.toString() }` ); }
    if ( getParams.page ) { params.push( `page=${ getParams.page.toString() }` ); }
    if ( getParams.sortc && getParams.sortc.trim() !== '' ) { params.push( `sortc=${ getParams.sortc.trim() }` ); }
    if ( getParams.sortd && getParams.sortd.trim() !== '' ) { params.push( `sortd=${ getParams.sortd.trim() }` ); }
    if ( getParams.search && getParams.search.trim() !== '' ) { params.push( `search=${ getParams.search.trim() }` ); }

    const queryParams: string[] = getParams.queryParams?.map( param => `${ param.name }=${ param.value }` ) || [];
    if ( queryParams.length > 0 ) { params.push( ...queryParams ); }

    if ( getParams.showFields ) {
      const showFields = this.arrayToParamsGetSelect( getParams.showFields );
      if ( showFields !== '' ) { params.push( `show_fields=${ showFields }` ); }
    }

    if ( params.length > 0 ) {
      return `?${ params.join( '&' ) }`;
    }

    return '';

  }

}
