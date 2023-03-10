import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { PaginatorModule } from 'primeng/paginator';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { UserListRoutingModule } from './user-list-routing.module';

import { UserListComponent } from './user-list.component';
import { UserEditComponent } from '../user-edit/user-edit.component';


@NgModule( {
  declarations: [
    UserListComponent,
  ],
  imports: [
    CommonModule,
    ConfirmDialogModule,
    DynamicDialogModule,
    UserListRoutingModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    RippleModule,
    ToggleButtonModule
  ]
} )
export class UserListModule { }
