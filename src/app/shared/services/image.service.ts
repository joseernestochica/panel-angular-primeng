import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, Observable } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class ImageService {

  private urlApi = environment.apiUrl;

  constructor (
    private http: HttpClient
  ) { }


  convertUrlImageFile ( imageUrl: string | undefined, imageName: string | undefined ): Observable<File> {

    if ( !imageUrl ) {
      return this.http.get( `${ this.urlApi }/imagen/no-image`, { responseType: 'blob' } ).pipe(
        map( ( imgBlobNo: Blob ) => new File( [ imgBlobNo ], 'no-image', { type: imgBlobNo.type } ) ) );
    }
    if ( !imageName ) {
      return this.http.get( `${ this.urlApi }/imagen/no-image`, { responseType: 'blob' } ).pipe(
        map( ( imgBlobNo: Blob ) => new File( [ imgBlobNo ], 'no-image', { type: imgBlobNo.type } ) ) );
    }

    return this.http.get( imageUrl, { responseType: 'blob' } ).pipe(
      map( ( imgBlob: Blob ) => new File( [ imgBlob ], imageName, { type: imgBlob.type } ) ),
      catchError( error => {
        return this.http.get( `${ this.urlApi }/imagen/no-image`, { responseType: 'blob' } ).pipe(
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

}
