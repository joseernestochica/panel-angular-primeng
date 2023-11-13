import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, Observable, of, Subscription, take, tap } from 'rxjs';
import { ImageGet, ImagesResponse, ImageInsert } from 'shared/interfaces';

@Injectable( {
  providedIn: 'root'
} )
export class ImageService {

  private subscriptions: Subscription[] = [];
  private urlApi = environment.apiUrl;
  private urlPost: string | undefined;

  constructor (
    private http: HttpClient
  ) { }

  private runSetImages ( imageParams: ImageInsert ): Observable<ImagesResponse | undefined> {

    return new Observable( ob => {

      if ( imageParams.imagesPic && imageParams.imagesPic.length > 0 ) { // Insertar Imagen

        const sb = this.postImages( imageParams ).subscribe( insImg => {
          if ( !insImg ) return ob.next( undefined );
          ob.next( insImg );
        } );

        this.subscriptions.push( sb );

      } else { // Eliminar la imagen

        const sbDel = this.deleteImages( imageParams ).subscribe( res => {
          if ( res ) ob.next( res );
          else ob.next( undefined );
        } );

        this.subscriptions.push( sbDel );

      }

    } );

  }

  private postImages ( imageParams: ImageInsert ): Observable<ImagesResponse | undefined> {

    const url = this.urlPost
      ? `${ this.urlApi }${ this.urlPost }${ imageParams.urlImg.replace( '[TYPE]', 'type_file' ) }`
      : `${ this.urlApi }/files/${ imageParams.urlImg.replace( '[TYPE]', 'type_file' ) }`;

    const formData = new FormData();

    for ( let image of imageParams.imagesPic ) {
      formData.append( 'images', image );
    }

    return this.http.post<ImagesResponse>( url, formData ).pipe(
      tap( res => res ),
      catchError( err => of( undefined ) )
    );

  }

  private deleteImages ( imageParams: ImageInsert ): Observable<ImagesResponse | undefined> {

    const url = `${ this.urlApi }/files/${ ( imageParams.urlDelete && imageParams.urlDelete !== '' )
      ? imageParams.urlDelete
      : imageParams.urlImg.replace( '[TYPE]', 'type_file' ) }`;

    return this.http.delete<ImagesResponse>( url ).pipe(
      tap( res => res ),
      catchError( err => of( undefined ) )
    );

  }

  getImage ( imgProp: ImageGet ): string {

    let url: string = `${ this.urlApi }/image/no-image`;

    if ( !imgProp.name || imgProp.name === '' ) { return url; }
    if ( !imgProp.type || imgProp.type === '' ) { return url; }
    if ( !imgProp.id || imgProp.id === '' ) { return url; }

    const isUrl = ( imgProp.name.indexOf( 'http' ) < 0 ) ? false : true;

    if ( !isUrl ) {

      switch ( imgProp.type ) {

        case 'imageUser':
          url = `${ this.urlApi }/image/${ imgProp.name }?type_file=${ imgProp.type }&user=${ imgProp.id }`;
          break;

      }

    } else url = imgProp.name;

    return url;

  }

  convertUrlImageFile ( imageUrl: string | undefined, imageName: string | undefined ): Observable<File> {

    if ( !imageUrl ) {
      return this.http.get( `${ this.urlApi }/image/no-image`, { responseType: 'blob' } ).pipe(
        map( ( imgBlobNo: Blob ) => new File( [ imgBlobNo ], 'no-image', { type: imgBlobNo.type } ) ) );
    }
    if ( !imageName ) {
      return this.http.get( `${ this.urlApi }/image/no-image`, { responseType: 'blob' } ).pipe(
        map( ( imgBlobNo: Blob ) => new File( [ imgBlobNo ], 'no-image', { type: imgBlobNo.type } ) ) );
    }

    return this.http.get( imageUrl, { responseType: 'blob' } ).pipe(
      map( ( imgBlob: Blob ) => new File( [ imgBlob ], imageName, { type: imgBlob.type } ) ),
      catchError( error => {
        return this.http.get( `${ this.urlApi }/image/no-image`, { responseType: 'blob' } ).pipe(
          map( ( imgBlobNo: Blob ) => new File( [ imgBlobNo ], 'no-image', { type: imgBlobNo.type } ) ) );
      } )
    );

  }

  setImage ( file: File | undefined ): Promise<string | ArrayBuffer | null> {

    return new Promise<string | ArrayBuffer | null>( res => {
      if ( file ) {
        const reader = new FileReader();
        reader.readAsDataURL( file );
        reader.onload = ( _event ) => res( reader.result );
      }
    } );

  }

  insertImagePic ( imageParams: ImageInsert ): Observable<ImagesResponse | undefined> {

    return new Observable( ob => {

      this.urlPost = imageParams.urlPost && imageParams.urlPost !== '' ? imageParams.urlPost : undefined;

      const sbInsPic = this.runSetImages( imageParams ).pipe( take( 1 ) ).subscribe( imgUpdate => {

        if ( imgUpdate && imgUpdate.images && imgUpdate.images.length > 0 ) ob.next( imgUpdate );
        else ob.next( undefined );

      } );

      this.subscriptions.push( sbInsPic );

    } );

  }

  dispose () {
    this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
  }

}
