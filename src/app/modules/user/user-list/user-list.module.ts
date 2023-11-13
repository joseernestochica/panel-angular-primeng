import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { UserListRoutingModule } from './user-list-routing.module';

import { AvatarModule } from 'primeng/avatar';
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

import { UserListComponent } from './user-list.component';


@NgModule( {
  declarations: [
    UserListComponent,
  ],
  imports: [
    AvatarModule,
    ButtonModule,
    CommonModule,
    ConfirmDialogModule,
    DropdownModule,
    DynamicDialogModule,
    InputTextModule,
    MultiSelectModule,
    PaginatorModule,
    RippleModule,
    TableModule,
    ToggleButtonModule,
    UserListRoutingModule,
  ]
} )
export class UserListModule { }
