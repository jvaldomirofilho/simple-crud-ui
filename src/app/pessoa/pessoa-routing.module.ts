import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PessoaCadastroComponent } from './pessoa-cadastro/pessoa-cadastro.component';
import { PessoasComponent } from './pessoas/pessoas.component';


const pessoaRoutes: Routes = [
  {path: 'pessoa', component: PessoasComponent},
  {path: 'pessoa/novo', component: PessoaCadastroComponent},
  {path: 'pessoa/:id', component: PessoaCadastroComponent}
];

@NgModule({
  imports: [RouterModule.forChild(pessoaRoutes)],
  exports: [RouterModule]
})
export class PessoaRoutingModule { }
