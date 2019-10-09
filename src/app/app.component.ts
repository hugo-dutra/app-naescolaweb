/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import * as firebase from 'firebase';
import { Router, NavigationEnd } from '@angular/router';
import { AcessoComumService } from './shared/acesso-comum/acesso-comum.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
  providers: [AcessoComumService],
})
export class AppComponent implements OnInit {

  constructor(private analytics: AnalyticsService, private router: Router, private acessoComumService: AcessoComumService) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        (<any>window).ga('set', 'page', event.urlAfterRedirects);
        (<any>window).ga('send', 'pageview');
      }
    });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.acessoComumService.pegarConfiguracaoFirebase().toPromise().then((response: Response) => {
      const config = JSON.parse(JSON.stringify(response));
      firebase.initializeApp(config);
    })
  }
}
