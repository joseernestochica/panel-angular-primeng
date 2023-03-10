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
    if ( getParams.sort_c && getParams.sort_c.trim() !== '' ) { params.push( `sort_c=${ getParams.sort_c.trim() }` ); }
    if ( getParams.sort_d && getParams.sort_d.trim() !== '' ) { params.push( `sort_d=${ getParams.sort_d.trim() }` ); }
    if ( getParams.search && getParams.search.trim() !== '' ) { params.push( `search=${ getParams.search.trim() }` ); }
    if ( getParams.searchSingle1 && getParams.searchSingle1.toString().trim() !== '' ) {
      params.push( `sg1=${ getParams.searchSingle1.toString().trim() }` );
    }
    if ( getParams.searchSingle2 && getParams.searchSingle2.toString().trim() !== '' ) {
      params.push( `sg2=${ getParams.searchSingle2.toString().trim() }` );
    }
    if ( getParams.searchSingle3 && getParams.searchSingle3.toString().trim() !== '' ) {
      params.push( `sg3=${ getParams.searchSingle3.toString().trim() }` );
    }
    if ( getParams.searchSingle4 && getParams.searchSingle4.toString().trim() !== '' ) {
      params.push( `sg4=${ getParams.searchSingle4.toString().trim() }` );
    }
    if ( getParams.searchSingle5 && getParams.searchSingle5.toString().trim() !== '' ) {
      params.push( `sg5=${ getParams.searchSingle5.toString().trim() }` );
    }
    if ( getParams.searchSingle6 && getParams.searchSingle6.toString().trim() !== '' ) {
      params.push( `sg6=${ getParams.searchSingle6.toString().trim() }` );
    }
    if ( getParams.searchSingle7 && getParams.searchSingle7.toString().trim() !== '' ) {
      params.push( `sg7=${ getParams.searchSingle7.toString().trim() }` );
    }
    if ( getParams.searchSingle8 && getParams.searchSingle8.toString().trim() !== '' ) {
      params.push( `sg8=${ getParams.searchSingle8.toString().trim() }` );
    }
    if ( getParams.searchSingle9 && getParams.searchSingle9.toString().trim() !== '' ) {
      params.push( `sg9=${ getParams.searchSingle9.toString().trim() }` );
    }
    if ( getParams.searchSingle10 && getParams.searchSingle10.toString().trim() !== '' ) {
      params.push( `sg10=${ getParams.searchSingle10.toString().trim() }` );
    }

    if ( getParams.select ) {
      const select = this.arrayToParamsGetSelect( getParams.select );
      if ( select !== '' ) { params.push( `select=${ select }` ); }
    }

    if ( params.length > 0 ) {
      return `?${ params.join( '&' ) }`;
    }

    return '';

  }

}
