import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {HomeComponent} from './home/home.component';
import { BhavcopyComponent } from './bhavcopy/bhavopy.component';
import { BhavcopyService } from './bhavcopy/bhavcopy.service';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BhavcopyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [BhavcopyService],
  bootstrap: [AppComponent]
})
export class AppModule { }
