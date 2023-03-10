import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig, Translation } from 'primeng/api';


@Component( {
    selector: 'app-root',
    templateUrl: './app.component.html'
} )
export class AppComponent implements OnInit {

    constructor ( private primengConfig: PrimeNGConfig ) { }

    ngOnInit () {
        this.primengConfig.ripple = true;
        this.primengConfig.setTranslation( {
            clear: 'Limpiar',
            apply: 'Aplicar',
            dayNames: [ "Domingo", "Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sábado" ],
            dayNamesShort: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ],
            dayNamesMin: [ "Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa" ],
            monthNames: [ "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre" ],
            monthNamesShort: [ "Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic" ],
            dateFormat: "dd/mm/yy",
            "firstDayOfWeek": 1,
        } );
    }
}
