import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app/componentes/app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SesionService } from "./app/service/sesion.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { PeticionInterceptor } from "./app/service/peticion.interceptor";
import { LocalService } from "./app/service/local.service";
import { StorageService } from "./app/service/storage.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";

@NgModule({
  declarations: [
    AppComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgbModule,
        MatTooltipModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule
    ],
  providers: [
    SesionService,
    LocalService,
    StorageService,
    { provide: HTTP_INTERCEPTORS, useClass: PeticionInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
