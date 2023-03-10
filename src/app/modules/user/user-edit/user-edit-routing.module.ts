import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserEditComponent } from './user-edit.component';


@NgModule( {
	imports: [ RouterModule.forChild( [
		{ path: ':userId', component: UserEditComponent },
		{ path: '**', redirectTo: '/notfound' }
	] ) ],
	exports: [ RouterModule ]
} )
export class UserEditRoutingModule { }
