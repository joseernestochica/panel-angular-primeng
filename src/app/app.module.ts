import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// Interceptores
import { RefreshTokenInterceptor } from './modules/auth/services/refresh-token.interceptor';

// --- Aplicación en castellano (ver también 'Providers') ---
import localEs from "@angular/common/locales/es";
registerLocaleData( localEs, 'es' );

// Servicios // ELIMINAR !!!
import { ProductService } from './demo/service/product.service';
import { CountryService } from './demo/service/country.service';
import { CustomerService } from './demo/service/customer.service';
import { EventService } from './demo/service/event.service';
import { IconService } from './demo/service/icon.service';
import { NodeService } from './demo/service/node.service';
import { PhotoService } from './demo/service/photo.service';

// Componentes
import { NotfoundComponent } from './modules/notfound/notfound.component';

// ------------------- Inicializar el usuario --------------------------
import { AuthService } from 'auth/services/auth.service';

function appInitializer ( authService: AuthService ) {
    // return new Promise( ( resolve ) => {
    //     authService.getUserByToken().subscribe().add();
    // } );
    return () => authService.getUserByToken();
}

@NgModule( {
    declarations: [
        AppComponent, NotfoundComponent
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule
    ],
    providers: [
        {
            provide: LocationStrategy, useClass: HashLocationStrategy
        },
        {
            provide: APP_INITIALIZER,
            useFactory: appInitializer,
            deps: [ AuthService ],
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RefreshTokenInterceptor,
            multi: true
        },
        {
            provide: LOCALE_ID,
            useValue: 'es' // Aplicación en Castellano
        },
        CountryService, CustomerService, EventService, IconService, NodeService,
        PhotoService, ProductService
    ],
    bootstrap: [ AppComponent ]
} )
export class AppModule { }
