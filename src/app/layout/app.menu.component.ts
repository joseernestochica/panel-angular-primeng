import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { AuthService } from 'auth/services/auth.service';
import { LayoutService } from './service/app.layout.service';

@Component( {
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
} )
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor (
        private authService: AuthService,
        private layoutService: LayoutService,
    ) { }

    ngOnInit () {

        const user = this.authService.currentUserValue;
        if ( !user || !user.roles ) {
            this.authService.logout();
            return;
        }

        const foundAdmin = user.roles.find( role => role === 'ADMIN' );
        if ( foundAdmin ) {
            this.setMenuAdmin();
            return;
        }

        const foundAuthor = user.roles.find( role => role === 'AUTHOR' );
        if ( foundAuthor ) {
            this.setMenuAuthor();
            return;
        }


    }

    private setMenuAdmin () {

        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [ '/' ] },
                    { label: 'Usuarios', icon: 'pi pi-users', routerLink: [ '/user/list' ] }
                ]
            }
        ];

    }

    private setMenuAuthor () {

        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: [ '/' ] }
                ]
            }
        ];

    }

}
