/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import * as firebase from 'firebase';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();

    const config = {
      apiKey: 'AIzaSyAfgiA5ogBvZXkZISWNWGOlPD8iID2KGzo',
      authDomain: 'naescolaweb-af337.firebaseapp.com',
      databaseURL: 'https://naescolaweb-af337.firebaseio.com',
      projectId: 'naescolaweb-af337',
      storageBucket: 'naescolaweb-af337.appspot.com',
      messagingSenderId: '134371598864',
    };
    firebase.initializeApp(config);
  }
}
