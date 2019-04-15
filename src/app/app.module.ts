/**
 * @ignore
 */
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ApttusModule } from '@apttus/core';
import { CommerceModule, StorefrontService, ConversionService } from '@apttus/ecommerce';
import { ConstraintRulesModule } from '@apttus/constraint-rules';
import { PromotionModule } from '@apttus/promotion';
import { AboModule } from '@apttus/abo';

import { environment } from '../environments/environment';
import { ComponentModule } from './components/component.module';
import { RouteGuard } from './services/route.guard';
import { AuthGuard } from './services/auth.guard';
import { ConfigureGuard } from './services/configure.guard';
import { ConstraintRuleGuard } from './services/constraint-rule.guard';

// Register locale data
import localeMx from '@angular/common/locales/es-MX';
import localeMxExtra from '@angular/common/locales/extra/es-MX';
import { registerLocaleData } from '@angular/common';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { ProductDrawerModule, ApttusModalModule, RenewModalComponent, TerminateModalComponent } from '@apttus/elements';

// If using additional locales, register the locale data here
registerLocaleData(localeMx, 'es-MX', localeMxExtra);

// Translations
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { AboGuard } from './services/aboGuard';
import { PSConversionService } from './services/ps-storefront-service';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApttusModule.forRoot(environment),
    CommerceModule.forRoot('thomsonreuters'),
    ProductDrawerModule,
    ModalModule.forRoot(),
    ApttusModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    HttpClientModule,
    ComponentModule,
    ConstraintRulesModule,
    PromotionModule,
    ServiceWorkerModule,
    AboModule
  ],
  providers: [RouteGuard, AuthGuard, AboGuard, ConfigureGuard, ConstraintRuleGuard],
  // {provide: ConversionService, useClass: PSConversionService}],
  bootstrap: [AppComponent]
})
export class AppModule { }
