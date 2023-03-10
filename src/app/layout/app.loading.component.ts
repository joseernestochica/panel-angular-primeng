import { Component } from '@angular/core';
import { LoadingService } from './service/loading.service';

@Component( {
  selector: 'app-app-loading',
  templateUrl: './app.loading.component.html',
  styles: [
  ]
} )
export class AppLoadingComponent {

  constructor (
    public loading: LoadingService
  ) { }

}
