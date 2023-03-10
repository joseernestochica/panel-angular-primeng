import { Injectable } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ButtonService } from 'shared/components/button/services/button.service';

@Injectable( {
  providedIn: 'root'
} )
export class FormCheckService {

  private subscriptions: Subscription[] = [];

  _formGroup?: FormGroup;
  _formArray?: FormArray;

  constructor (
    private buttonService: ButtonService
  ) { }

  set formGroup ( form: FormGroup ) {
    this._formGroup = form;
  }

  set formArray ( formArray: FormArray ) {
    this._formArray = formArray;
  }

  get ( validacion: string, controlName?: string | number, validation?: string, controlNameArray?: string ): boolean | undefined {

    switch ( validacion ) {

      case 'isValid':
        return this.isControlValid( controlName as string );

      case 'isInvalid':
        return this.isControlInvalid( controlName as string );

      case 'isValidArr':
        return this.isControlValidArr( controlName as number );

      case 'isInvalidArr':
        return this.isControlInvalidArr( controlName as number );

      case 'hasError':
        if ( !validation ) return;
        return this.controlHasError( validation, controlName as string );

      case 'hasErrorArr':
        if ( !validation || !controlNameArray ) return;
        return this.controlHasErrorArr( validation, controlName as number, controlNameArray );

      case 'hasErrorNoTouch':
        if ( !validation ) return;
        return this.controlHasErrorNoTouch( validation, controlName as string );

      case 'hasErrorNoTouchArr':
        if ( !validation || !controlNameArray ) return;
        return this.controlHasErrorNoTouchArr( validation, controlName as number, controlNameArray );

    }

    return false;

  }

  checkErrorForm ( errorControl = 'error' ) {

    if ( !this._formGroup ) return;

    const event = this._formGroup.valueChanges.pipe(
      debounceTime( 150 ),
      distinctUntilChanged()
    ).subscribe( val => {
      if ( this._formGroup?.invalid ) this.buttonService.buttonType$.next( errorControl );
      else this.buttonService.buttonType$.next( 'on' );
    } );

    this.subscriptions.push( event );

  }

  private isControlValid ( controlName: string ): boolean | undefined {

    if ( !this._formGroup ) return;

    const control = this._formGroup.controls[ controlName ];
    if ( !control ) return;

    return control.valid && ( control.dirty || control.touched );

  }

  private isControlValidArr ( i: number ): boolean | undefined {

    if ( !this._formArray ) return;

    const control = this._formArray.controls[ i ];
    if ( !control ) return;

    return control.valid && ( control.dirty || control.touched );
  }

  private isControlInvalid ( controlName: string ): boolean | undefined {

    if ( !this._formGroup ) return;

    const control = this._formGroup.controls[ controlName ];
    if ( !control ) return;

    return control.invalid && ( control.dirty || control.touched );
  }

  isControlInvalidArr ( i: number ): boolean | undefined {

    if ( !this._formArray ) return;

    const control = this._formArray.controls[ i ];
    if ( !control ) return;

    return control.invalid && ( control.dirty || control.touched );
  }

  private controlHasError ( validation: string, controlName: string ): boolean | undefined {

    if ( !this._formGroup ) return;

    const control = this._formGroup.controls[ controlName ];
    if ( !control ) return;

    return control.hasError( validation ) && ( control.dirty || control.touched );
  }

  private controlHasErrorArr ( validation: string, i: number, controlNameArray: string ): boolean | undefined {

    if ( !this._formArray ) return;

    const control = this._formArray.controls[ i ];
    if ( !control ) return;

    return control.hasError( validation, controlNameArray ) && ( control.dirty || control.touched );
  }

  private controlHasErrorNoTouch ( validation: string, controlName: string ): boolean | undefined {

    if ( !this._formGroup ) return;

    const control = this._formGroup.controls[ controlName ];
    if ( !control ) return;

    return control.hasError( validation );
  }

  private controlHasErrorNoTouchArr ( validation: string, i: number, controlNameArray: string ): boolean | undefined {

    if ( !this._formArray ) return;

    const control = this._formArray.controls[ i ];
    if ( !control ) return;

    return control.hasError( validation, controlNameArray );
  }

  dispose () {
    this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
  }

}
