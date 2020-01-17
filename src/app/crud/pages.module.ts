import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { PagesRoutingModule } from './pages-routing.module';
import { AlertaModule } from './alerta/alerta.module';
import { AccessModule } from '../access/access.module';
import { PaginaInicialModule } from '../shared/pagina-inicial/pagina-inicial.module';


@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    AlertaModule,
    AccessModule,
    PaginaInicialModule,
  ],
  declarations: [
    PagesComponent,
  ],
})
export class PagesModule {
}
