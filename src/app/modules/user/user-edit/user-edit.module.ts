import { ButtonModule } from 'shared/components/button/button.module';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { PasswordModule } from 'primeng/password';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { UserEditRoutingModule } from './user-edit-routing.module';

import { UserEditComponent } from './user-edit.component';



@NgModule( {
  declarations: [
    UserEditComponent
  ],
  imports: [
    AvatarModule,
    ButtonModule,
    CalendarModule,
    CheckboxModule,
    CommonModule,
    DividerModule,
    DropdownModule,
    FormsModule,
    InputTextModule,
    MessageModule,
    MultiSelectModule,
    PasswordModule,
    ReactiveFormsModule,
    SelectButtonModule,
    ToastModule,
    UserEditRoutingModule
  ]
} )
export class UserEditModule { }
