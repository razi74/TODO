import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { HTTP_PROVIDERS, Http, Response } from '@angular/http';
import {enableProdMode} from  '@angular/core';
enableProdMode();
bootstrap(AppComponent, [HTTP_PROVIDERS]);
