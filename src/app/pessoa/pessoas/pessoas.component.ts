import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { PessoaService, PessoaFiltro } from './../pessoa.service';
import { map } from 'rxjs/operators';
import { Page } from '../../models/page';
import { Pessoa } from '../../models/pessoa';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'jv-pessoas',
  templateUrl: './pessoas.component.html'
})
export class PessoasComponent implements OnInit {

  pessoaForm: FormGroup;

  closeResult: string;
  pessoas: Pessoa[];
  page: Page<Pessoa> = new Page();
  pessoaSelecionada: Pessoa;

  @Input() currentPage;

  cpfPattern = Validators.pattern('^([0-9]){3}\.([0-9]){3}\.([0-9]){3}-([0-9]){2}$');
  numberPattern = Validators.pattern(/^[0-9]*$/);

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private route: ActivatedRoute,
    private zone: NgZone
  ) {
    this.pessoaForm = this.fb.group({
      nome: [''],
      cpf: ['', [this.numberPattern, Validators.minLength(11), Validators.maxLength(11)]]
    });
    this.currentPage = 1;
  }

  ngOnInit() {
    if (this.route.snapshot.params && this.route.snapshot.params.searchAll) {
      this.pesquisar();
    } else if (this.route.snapshot.params
      && this.route.snapshot.params.nome
      && this.route.snapshot.params.cpf
    ) {
      this.pessoaForm.get('nome').setValue(this.route.snapshot.params.nome);
      this.pessoaForm.get('cpf').setValue(this.route.snapshot.params.cpf);
      this.pesquisar();
    }
  }

  gerar() {
    const pessoaFiltro: PessoaFiltro = this.pessoaForm.value;
    this.pessoaService.relatorioPessoa(pessoaFiltro)
    .subscribe((data) => window.open(window.URL.createObjectURL(data)));
  }

  pesquisar(numeroPagina?: number) {
    const pessoaFiltro: PessoaFiltro = this.pessoaForm.value;
    if (numeroPagina) {
      pessoaFiltro.pagina = numeroPagina - 1;
      this.currentPage = numeroPagina;
    } else {
      pessoaFiltro.pagina = this.currentPage - 1;
    }
    pessoaFiltro.itensPorPagina = 20;
    this.pessoaService.pesquisar(pessoaFiltro)
      .subscribe((data) => {
        this.page = data;
      });
  }

  remover(pessoa: Pessoa): void {
    this.zone.run(() => {
      this.pessoaService.remover(pessoa.id)
        .subscribe(() => this.pesquisar());
    });
  }

}
