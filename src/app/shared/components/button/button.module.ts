import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonStateComponent } from './button-state/button-state.component';
import { ButtonModule as ButtonPrimeNg } from 'primeng/button';

@NgModule( {
  declarations: [
    ButtonStateComponent
  ],
  imports: [
    CommonModule,
    ButtonPrimeNg
  ],
  exports: [
    ButtonStateComponent
  ]
} )
export class ButtonModule { }
