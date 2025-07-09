import { Component, OnInit } from '@angular/core';


@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html'
} )
export class AppComponent implements OnInit {

    constructor () { }

    ngOnInit () {
        // PrimeNG 18 no requiere configuración global
        // Las traducciones se manejan a nivel de componente
    }
}
