import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { AuthService } from 'auth/services/auth.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonService } from 'shared/components/button/services/button.service';
import { FormCheckService } from 'shared/services/form-check.service';
import { ImageService } from 'shared/services/image.service';
import { LocationService } from 'shared/services/location.service';
import { UserService } from '../services/user.service';

import { ICountryModel, LocationModel } from 'shared/models';
import { UserModel } from 'auth/models/user.model';

@Component( {
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
} )
export class UserEditComponent implements OnInit, OnDestroy {

  private imgFile: File | undefined;
  private subscriptions: Subscription[] = [];
  private userId: number | undefined;
  private user: UserModel | undefined;

  cities: LocationModel[] = [];
  countries: ICountryModel[] = [];
  countryCode: string | null = null;
  formGroup: FormGroup | undefined;
  img: string = 'assets/layout/images/noImage.png';
  isErrorEmailDuplicate = false;
  loading: boolean = true;
  states: LocationModel[] = [];
  userIdRoute: string | null = null;

  constructor (
    private authService: AuthService,
    private buttonService: ButtonService,
    private config: DynamicDialogConfig,
    private fb: FormBuilder,
    private imageService: ImageService,
    private locationService: LocationService,
    private ref: DynamicDialogRef,
    private route: ActivatedRoute,
    private userService: UserService,
    public formCheck: FormCheckService,
  ) { }

  async ngOnInit (): Promise<void> {

    this.userIdRoute = this.route.snapshot.paramMap.get( 'userId' );
    this.countries = await this.locationService.getAllCountries( {} ) || [];

    this.userId = this.config.data?.id
      ? this.config.data.id
      : this.userIdRoute ? parseInt( this.userIdRoute ) : undefined;
    this.loadUser();

  }

  private loadUser () {

    if ( this.userId ) {

      const sb = this.userService.getOne( { id: this.userId } ).subscribe( async res => {

        if ( !res ) { this.ref.close(); }
        this.user = res;

        this.loadForm();
        this.countryCode = this.user?.country || null;
        await this.setStates( this.countryCode );
        await this.setCities( this.user?.state );
        this.loading = false;

      } );
      this.subscriptions.push( sb );

    } else {

      this.user = new UserModel();
      this.loadForm();
      this.loading = false;

    }

  }

  private loadForm () {

    if ( !this.user ) { return; }

    this.formGroup = this.fb.group( {

      name: [ this.user.name, Validators.compose( [ Validators.required, Validators.minLength( 2 ) ] ) ],
      surnames: [ this.user.surnames, Validators.compose( [ Validators.required, Validators.minLength( 2 ) ] ) ],
      email: [ this.user.email, Validators.compose(
        [ Validators.required, Validators.pattern( '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$' ) ] ), ],
      nif: [ this.user.nif, Validators.compose( [ Validators.required, Validators.minLength( 9 ) ] ) ],
      phone: [ this.user.phone, Validators.compose( [ Validators.required, Validators.minLength( 9 ) ] ) ],
      password: [ '' ],
      active: [ this.user.active ],
      roles: [ this.user.roles, Validators.required ],
      address: [ this.user.address, Validators.compose( [ Validators.required, Validators.minLength( 9 ) ] ) ],
      postal_code: [ this.user.postal_code, Validators.required ],
      country: [ this.user.country, Validators.required ],
      state: [ this.user.state, Validators.required ],
      city: [ this.user.city, Validators.required ],

    } );


    // Desactivar el campo de contraseña si se está editando un usuario
    // Solo activo para la edición de perfil e inserción
    if ( !this.userIdRoute && this.userId ) { this.formGroup.controls[ 'password' ].disable(); }

    // Desactar campos active y roles si se está editando el perfil
    // Solo activos en la edición de usuario con role admin
    if ( this.userIdRoute ) {
      this.formGroup.controls[ 'active' ].disable();
      this.formGroup.controls[ 'roles' ].disable();
    }

    if ( !this.userId ) {
      this.formGroup.controls[ 'password' ].setValidators( [
        Validators.required, Validators.minLength( 8 ),
        Validators.pattern( '(?=\\D*\\d)(?=[^a-z]*[a-z])(?=[^A-Z]*[A-Z]).{8,30}' ) ] );
      this.formGroup.controls[ 'password' ].updateValueAndValidity();
    }

    this.formCheck.formGroup = this.formGroup;
    this.formGroup.valueChanges.subscribe( () => {
      this.isErrorEmailDuplicate = false;
      if ( this.formGroup?.valid ) { this.buttonService.dispose() }
    } );

  }

  private onErrorEmailExists () {

    this.buttonService.buttonType$.next( 'error' );
    this.isErrorEmailDuplicate = true;

  }

  private saveUpdate ( formValues: UserModel ) {

    const sb = this.userService.editOne( { id: this.userId, body: formValues } ).subscribe( res => {

      if ( res && res.alert && res.alert === 'email_exists' ) {
        this.onErrorEmailExists();
        return;
      }

      this.buttonService.buttonType$.next( 'save' );

      if ( this.userIdRoute ) { // Propagar los cambios en la edición de perfil
        this.authService.currentUserValue = res?.user;
      }

    } );
    this.subscriptions.push( sb );

  }

  private saveCreate ( formValues: UserModel ) {

    const sb = this.userService.createOne( { body: formValues } ).subscribe( res => {

      if ( res && res.alert && res.alert === 'email_exists' ) {
        this.onErrorEmailExists();
        return;
      }

      this.ref.close();

    } );
    this.subscriptions.push( sb );

  }

  save () {

    if ( !this.formGroup ) { return; }
    if ( !this.formGroup.valid ) {
      this.formGroup.markAllAsTouched();
      this.buttonService.buttonType$.next( 'error' );
      return;
    }

    this.buttonService.buttonType$.next( 'saveTime' );

    const formValues: UserModel = this.formGroup.value;
    if ( !formValues.password || formValues.password?.trim() === '' ) { delete formValues.password; }

    if ( this.userId ) { this.saveUpdate( formValues ); }
    else { this.saveCreate( formValues ); }

  }

  insertPic ( event: any ) {

    if ( event.target.files && event.target.files[ 0 ] ) {
      this.imgFile = event.target.files[ 0 ];
      this.imageService.setImage( this.imgFile ).then( img => this.img = img as string );
    }

  }

  deletePic () {

    this.imgFile = undefined;
    this.img = 'assets/layout/images/noImage.png';

  }

  async setStates ( country: string | null, isChange = false ) {

    if ( !this.formGroup ) { return; }
    this.states = [];
    this.cities = [];

    if ( isChange ) {
      this.formGroup.get( 'state' )?.setValue( '' );
      this.formGroup.get( 'city' )?.setValue( '' );
    }

    if ( !country ) { return; }
    this.countryCode = country;

    this.states = await this.locationService.getStatesbyCountry( { country_iso: country } ) || [];

  }

  async setCities ( state: string | undefined, isChange = false ) {

    if ( !this.formGroup ) { return; }
    this.cities = [];

    if ( isChange ) {
      this.formGroup.get( 'city' )?.setValue( '' );
    };

    if ( !this.countryCode || !state ) { return; }

    this.cities = await this.locationService.getCitiesByCountryAndState( { country_iso: this.countryCode, state_id: state } ) || [];

  }

  ngOnDestroy (): void {
    this.subscriptions.forEach( ( sb ) => sb.unsubscribe() );
    this.buttonService.dispose();
    this.locationService.dispose();
  }

}
