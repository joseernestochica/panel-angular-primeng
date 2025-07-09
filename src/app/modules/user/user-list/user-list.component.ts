import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin, Subscription } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { Table, TableLazyLoadEvent } from 'primeng/table';

import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ImageService } from 'shared/services/image.service';
import { LoadingService } from 'app/layout/service/loading.service';
import { tableColumns } from './table-column'
import { UserService } from '../services/user.service';

import { imgagesDefault } from 'environments/environment';
import { GetParamsQueryParams } from 'shared/interfaces';
import { TableColumnModel } from 'shared/components/table/models/table-column.model';
import { UserEditComponent } from '../user-edit/user-edit.component';
import { UserModel } from 'auth/models/user.model';

@Component( {
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  providers: [ DatePipe, ConfirmationService, DialogService ]
} )
export class UserListComponent implements OnInit, OnDestroy {

  private event: TableLazyLoadEvent | undefined;
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
    private imageService: ImageService,
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
    for ( const column of this.columns ) {
      if ( column.active ) { this.selectecColumns.push( column ); }
    }

  }

  private formatElements () {

    this.users.map( user => {
      user.created_at = this.datePipe.transform( user.created_at, 'medium' ) || '';
      user.img = user.img && user.img !== ''
        ? this.imageService.getImage( { name: user.img, type: 'imageUser', id: `${ user.id }` } )
        : imgagesDefault.profile;
    } );

  }

  private setQueryParams ( filters: any ): GetParamsQueryParams[] {

    const queryParams: GetParamsQueryParams[] = [];

    if ( filters.name && filters.name[ 0 ] && filters.name[ 0 ].value ) {
      queryParams.push( { name: 'name', value: filters.name[ 0 ].value } );
    }
    if ( filters.surnames && filters.surnames[ 0 ] && filters.surnames[ 0 ].value ) {
      queryParams.push( { name: 'surnames', value: filters.surnames[ 0 ].value } );
    }
    if ( filters.email && filters.email[ 0 ] && filters.email[ 0 ].value ) {
      queryParams.push( { name: 'email', value: filters.email[ 0 ].value } );
    }
    if ( filters.isActive && filters.isActive[ 0 ] && filters.isActive[ 0 ].value ) {
      queryParams.push( { name: 'active', value: filters.email[ 0 ].value === true ? '1' : '0' } );
    }

    return queryParams;

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

  loadUsers ( event: TableLazyLoadEvent | undefined ) {

    this.total = 0;
    this.users = [];
    this.selectedUsers = [];

    this.event = event;
    const filters: any = this.event?.filters || undefined;

    const sb = this.userService.getMany( {
      limit: this.event?.rows || undefined,
      page: ( ( this.event?.first || 0 ) + ( this.event?.rows || 10 ) ) / ( this.event?.rows || 10 ),
      sortc: typeof this.event?.sortField === 'string' ? this.event.sortField : undefined,
      sortd: this.event?.sortOrder === 1 ? 'ASC' : 'DESC',
      search: typeof this.event?.globalFilter === 'string' && this.event.globalFilter !== '' ? this.event.globalFilter : '',
      queryParams: this.setQueryParams( filters ),
    } ).subscribe( res => {

      this.loading.loading$.next( false );
      if ( !res || !res.users ) { return; }

      this.users = res.users;
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
