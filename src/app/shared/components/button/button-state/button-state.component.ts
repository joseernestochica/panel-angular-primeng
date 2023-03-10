import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ButtonService } from '../services/button.service';

@Component( {
  selector: 'app-button-state',
  templateUrl: './button-state.component.html',
  styleUrls: [ './button-state.component.scss' ]
} )
export class ButtonStateComponent implements OnInit {

  @Input() titleOff: string = '';
  @Input() titleOn: string = '';
  @Input() titleSaving: string = '';
  @Input() titleSave: string = '';
  @Input() titleError: string = '';
  @Input() titleErrorSave: string = '';
  @Input() classButton: string = '';

  buttonType$: Observable<string>;

  constructor (
    public buttonService: ButtonService,
  ) {
    this.buttonType$ = this.buttonService.buttonType$.asObservable();
  }


  ngOnInit (): void {

    if ( this.titleOff === '' ) this.titleOff = 'Guardar cambios';
    if ( this.titleOn === '' ) this.titleOn = 'Guardar cambios';
    if ( this.titleSaving === '' ) this.titleSaving = 'Guardando cambios';
    if ( this.titleSave === '' ) this.titleSave = 'Cambios guardados';
    if ( this.titleError === '' ) this.titleError = 'Error. Rellena correctamente los campos';
    if ( this.titleErrorSave === '' ) this.titleErrorSave = 'Ha habido un error al guardar';

  }

}
