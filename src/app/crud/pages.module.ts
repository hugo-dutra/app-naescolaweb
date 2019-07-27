import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { AlertaModule } from './alerta/alerta.module';
import { AccessModule } from '../access/access.module';
import { MenuAtalhoComponent } from '../shared/pagina-inicial/menu-atalho/menu-atalho.component';

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    ECommerceModule,
    MiscellaneousModule,
    AlertaModule,
    AccessModule,
  ],
  declarations: [
    PagesComponent,
    MenuAtalhoComponent
  ],
})
export class PagesModule {
}
