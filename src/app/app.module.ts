import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { DirectiveModule, PipeModule, ComponentModule } from '@thisui';

import { PPublicPresentationComponent } from './p-public_presentation/p-public_presentation.component';

// 框架統一由 component module 匯入 ex: material, ionic
@NgModule({
  declarations: [
    AppComponent,

    PPublicPresentationComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    DirectiveModule,
    PipeModule,
    ComponentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
