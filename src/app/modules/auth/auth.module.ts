import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule( { imports: [CommonModule,
        AuthRoutingModule], providers: [provideHttpClient(withInterceptorsFromDi())] } )
export class AuthModule { }
