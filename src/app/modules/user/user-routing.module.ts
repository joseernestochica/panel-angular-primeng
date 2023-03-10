import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthGuardAdmin } from 'auth/services/auth-admin.guard';
import { AuthGuardAuthor } from 'auth/services/auth-author.guard';

@NgModule( {
	imports: [ RouterModule.forChild( [
		{
			path: 'list', loadChildren: () => import( './user-list/user-list.module' ).then( m => m.UserListModule ),
			canActivate: [ AuthGuardAdmin ]
		},
		{
			path: 'edit', loadChildren: () => import( './user-edit/user-edit.module' ).then( m => m.UserEditModule )
		},
		{ path: '**', redirectTo: '/notfound' }
	] ) ],
	exports: [ RouterModule ]
} )
export class UserRoutingModule { }
