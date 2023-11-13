import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'auth/services/auth.service';
import { ButtonService } from 'shared/components/button/services/button.service';
import { FormCheckService } from 'shared/services/form-check.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { MessageService } from 'primeng/api';
import { UserModel } from 'auth/models/user.model';

@Component( {
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [ `
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [ MessageService ]
} )
export class LoginComponent implements OnInit, OnDestroy {

    private subscriptions: Subscription[] = [];

    valCheck: string[] = [ 'remember' ];
    password!: string;
    formGroup: FormGroup | undefined;

    constructor (
        private authService: AuthService,
        private buttonService: ButtonService,
        private fb: FormBuilder,
        private messageService: MessageService,
        private router: Router,
        public formCheck: FormCheckService,
        public layoutService: LayoutService,
    ) { }

    ngOnInit (): void {

        const user: UserModel | undefined = this.authService.currentUserValue;
        if ( user ) { this.router.navigateByUrl( '/' ); }

        this.loadForm();

        const sb = this.authService.errorLogin$.subscribe( error => {
            if ( error ) {
                this.messageService.add( { severity: 'error', summary: 'Error', detail: 'Login incorrecto.\nUsuari@ o contraseña erróneos' } );
                this.buttonService.buttonType$.next( 'errorSave' );
            }
        } );
        this.subscriptions.push( sb );

    }

    private loadForm () {

        this.formGroup = this.fb.group( {
            email: [
                'joseernestochica@gmail.com', Validators.compose( [ Validators.required, Validators.email, Validators.minLength( 3 ), Validators.maxLength( 320 ), ] ), ],
            password: [
                '123456', Validators.compose( [ Validators.required, Validators.minLength( 3 ), Validators.maxLength( 100 ), ] ), ],
        } );

        this.formCheck.formGroup = this.formGroup;
        this.formCheck.checkErrorForm();

    }

    login () {

        if ( !this.formGroup?.valid ) { return; }

        this.buttonService.buttonType$.next( 'saveNoTime' );

        const sb = this.authService.login( this.formGroup.value.email, this.formGroup.value.password ).subscribe( user => {
            if ( !user ) {
                this.authService.errorLogin$.next( true );
                return;
            }
            this.authService.currentUserSubject.next( user );
            this.router.navigateByUrl( '/' );
        } );
        this.subscriptions.push( sb );

    }

    ngOnDestroy () {
        this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
        this.buttonService.dispose();
    }


}
