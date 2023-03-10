import { AppConfigModule } from './config/config.module';
import { AppFooterComponent } from './app.footer.component';
import { AppLayoutComponent } from "./app.layout.component";
import { AppMenuComponent } from './app.menu.component';
import { AppMenuitemComponent } from './app.menuitem.component';
import { AppSidebarComponent } from "./app.sidebar.component";
import { AppSidebarProfileComponent } from './app-sidebar-profile.component';
import { AppTopBarComponent } from './app.topbar.component';
import { AvatarModule } from 'primeng/avatar';
import { BadgeModule } from 'primeng/badge';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { NgModule } from '@angular/core';
import { ProgressBarModule } from 'primeng/progressbar';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { RouterModule } from '@angular/router';
import { SidebarModule } from 'primeng/sidebar';
import { AppLoadingComponent } from './app.loading.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

@NgModule( {
    declarations: [
        AppFooterComponent,
        AppLayoutComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppSidebarComponent,
        AppSidebarProfileComponent,
        AppTopBarComponent,
        AppLoadingComponent,
    ],
    imports: [
        AppConfigModule,
        AvatarModule,
        BadgeModule,
        BrowserAnimationsModule,
        BrowserModule,
        ButtonModule,
        FormsModule,
        HttpClientModule,
        InputSwitchModule,
        InputTextModule,
        ProgressBarModule,
        RadioButtonModule,
        RippleModule,
        RouterModule,
        SidebarModule,
    ],
    exports: [ AppLayoutComponent ],
    providers: [ DynamicDialogConfig, DynamicDialogRef ]
} )
export class AppLayoutModule { }
