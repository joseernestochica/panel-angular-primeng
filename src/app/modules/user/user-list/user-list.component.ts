import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

import { ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoadingService } from 'app/layout/service/loading.service';
import { tableColumns } from './table-column'
import { UserService } from '../services/user.service';

import { TableColumnModel } from 'shared/components/table/models/table-column.model';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserModel } from 'auth/models/user.model';

@Component( {
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  providers: [ DatePipe, ConfirmationService, DialogService ]
} )
export class UserListComponent implements OnInit, OnDestroy {

  private event: LazyLoadEvent | undefined;
  private subscriptions: Subscription[] = [];

  columns: TableColumnModel[] = [];
  selectAll: boolean = false;
  selectedUsers: UserModel[] = [];
  selectecColumns: TableColumnModel[] = [];
  ref: DynamicDialogRef | undefined;
  total: number = 0;
  users: UserModel[] = [];

  @ViewChild( 'filter' ) filter!: ElementRef;

  constructor (
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private datePipe: DatePipe,
    private userService: UserService,
    public loading: LoadingService,
  ) {
    this.loading.loading$.next( true );
  }

  ngOnInit (): void {

    this.setColumns();

  }

  private setColumns () {

    this.columns = tableColumns;
    this.selectecColumns.push( this.columns[ 0 ], this.columns[ 1 ], this.columns[ 2 ], this.columns[ 3 ], this.columns[ 4 ] );

  }

  private formatElements () {

    this.users.map( user => {
      user.createdAt = this.datePipe.transform( user.createdAt, 'medium' ) || '';
    } );

  }

  onChangeColumn () {

    if ( this.selectecColumns.length === 0 ) {
      this.selectecColumns.push( this.columns[ 0 ] );
    }

    for ( let i = 0; i < this.columns.length; i++ ) {

      const found = this.selectecColumns.find( selectedColumn => selectedColumn.field === this.columns[ i ].field );
      if ( found ) { this.columns[ i ].active = true; }
      else { this.columns[ i ].active = false; }

    }

  }

  loadUsers ( event: LazyLoadEvent | undefined ) {

    this.total = 0;
    this.users = [];
    this.selectedUsers = [];

    this.event = event;
    const filters: any = this.event?.filters || undefined;

    const sb = this.userService.getMany( {
      limit: this.event?.rows,
      page: ( ( this.event?.first || 0 ) + ( this.event?.rows || 10 ) ) / ( this.event?.rows || 10 ),
      sort_c: this.event?.sortField,
      sort_d: this.event?.sortOrder === 1 ? 'ASC' : 'DESC',
      search: this.event?.globalFilter && this.event.globalFilter !== '' ? this.event.globalFilter : '',
      searchSingle1: filters.name && filters.name[ 0 ] && filters.name[ 0 ].value ? filters.name[ 0 ].value : undefined,
      searchSingle2: filters.surnames && filters.surnames[ 0 ] && filters.surnames[ 0 ].value ? filters.surnames[ 0 ].value : undefined,
      searchSingle3: filters.email && filters.email[ 0 ] && filters.email[ 0 ].value ? filters.email[ 0 ].value : undefined,
      searchSingle4: filters.isActive && filters.isActive[ 0 ] && filters.isActive[ 0 ].value === true ? 'true'
        : filters.isActive && filters.isActive[ 0 ] && filters.isActive[ 0 ].value === false ? 'false' : undefined,
    } ).subscribe( res => {

      this.loading.loading$.next( false );
      if ( !res || !res.data ) { return; }

      this.users = res.data as UserModel[];
      this.formatElements();
      this.total = res.total || 0;

    } );
    this.subscriptions.push( sb );

  }

  onSelectionChange ( value = [] ) {
    this.selectAll = value.length === this.total;
    this.selectedUsers = value;
  }

  onSelectAllChange ( event: any ) {
    const checked = event.checked;

    if ( checked ) {

      this.selectAll = true;
      this.selectedUsers = this.users;

    }
    else {
      this.selectedUsers = [];
      this.selectAll = false;
    }


  }

  onGlobalFilter ( table: Table, event: Event ) {
    table.filterGlobal( ( event.target as HTMLInputElement ).value, 'contains' );
  }

  clear ( table: Table ) {
    table.clear();
    this.filter.nativeElement.value = '';
  }

  onEditInsertElement ( element?: UserModel ) {

    this.ref = this.dialogService.open( UserEditComponent, {
      header: element ? `Editar usuario: ${ element.name }` : 'Insertar nuevo usuario',
      width: '70%',
      dismissableMask: true,
      data: {
        id: element ? element.id : undefined
      },
      maximizable: true,
      contentStyle: { "overflow": "auto" },
    } );

    this.ref.onClose.subscribe( () => { this.loadUsers( this.event ) } );

  }

  deleteUsers () {

    if ( !this.selectedUsers || this.selectedUsers.length === 0 ) { return; }

    this.confirmationService.confirm( {
      accept: () => {

        this.loading.loading$.next( true );

        const obs = [];
        for ( const selectedUser of this.selectedUsers ) {
          obs.push( this.userService.deleteOne( { id: selectedUser.id } ) );
        }

        const sb = forkJoin( obs ).subscribe( res => {
          this.loading.loading$.next( false );
          if ( res ) { this.loadUsers( this.event ); }
        } );
        this.subscriptions.push( sb );

      }
    } );

  }

  ngOnDestroy (): void {
    this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
  }

}
