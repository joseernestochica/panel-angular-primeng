import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Injectable( {
  providedIn: 'root'
} )
export class ButtonService {

  private subscriptions: Subscription[] = [];
  buttonType$: BehaviorSubject<string>;

  constructor () {
    this.buttonType$ = new BehaviorSubject<string>( 'on' );
    this.changeButton();
  }

  private changeButton () {

    this.buttonType$.subscribe( res => {

      if ( !res || res === '' ) return;

      if ( res === 'save' || res === 'errorSave' ) {

        // Cambiar a on pasados 3 segundos
        setTimeout( () => {
          this.buttonType$.next( 'on' );
        }, 3000 );

      }

      // Crear un retardo de 1 segundo cuando se guarda
      if ( res === 'saveTime' ) {
        setTimeout( () => {
          if ( this.buttonType$.value === 'error' || this.buttonType$.value === 'errorSave' ) { return; }
          this.buttonType$.next( 'save' );
        }, 1000 );
      }

    } );

  }

  dispose () {
    this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
    this.buttonType$.next( 'on' );
  }

}
