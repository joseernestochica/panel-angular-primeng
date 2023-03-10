import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './modules/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from 'auth/services/auth.guard';

@NgModule( {
    imports: [
        RouterModule.forRoot( [
            {
                path: '', component: AppLayoutComponent,
                children: [
                    {
                        path: '',
                        canActivate: [ AuthGuard ],
                        loadChildren: () => import( './modules/dashboard/dashboard.module' ).then( m => m.DashboardModule )
                    },
                    {
                        path: 'user',
                        canActivate: [ AuthGuard ],
                        loadChildren: () => import( './modules/user/user.module' ).then( m => m.UserModule )
                    }
                ]
            },
            { path: 'auth', loadChildren: () => import( './modules/auth/auth.module' ).then( m => m.AuthModule ) },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' } )
    ],
    exports: [ RouterModule ]
} )
export class AppRoutingModule {
}
