import { CoreModule } from './../shared/core.module';
import { NgModule } from '@angular/core';
import {CalendarModule} from 'primeng/calendar';
import {BrowserModule} from '@angular/platform-browser';
import { TooltipModule } from 'primeng/tooltip';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { PessoaRoutingModule } from './pessoa-routing.module';
import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import {FileUploadModule} from 'primeng/fileupload';

import { PessoasComponent } from './pessoas/pessoas.component';


@NgModule({
  imports: [
    CoreModule,
    BrowserModule,
    BrowserAnimationsModule,
    CalendarModule,
    FileUploadModule,
    TooltipModule,
    PessoaRoutingModule
  ],
  declarations: [PessoaCadastroComponent, PessoasComponent]
})
export class PessoaModule { }