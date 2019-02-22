import { Pessoa } from './../../models/pessoa';
import { Telefone } from './../../models/telefone';
import { Component, OnInit, NgZone } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { PessoaService } from '../pessoa.service';
import { switchMap } from 'rxjs/operators';
import { Subscriber, Observable } from 'rxjs';

@Component({
  selector: 'jv-pessoa-cadastro',
  templateUrl: './pessoa-cadastro.component.html'
})
export class PessoaCadastroComponent implements OnInit {

  pessoaCadForm: FormGroup;
  telefonesForm: FormGroup;

  filew: File;

  pessoaSelecionada: Pessoa = new Pessoa();

  isEdit = false;

  pageTitle = 'Cadastro Pessoa';

  // tslint:disable-next-line:max-line-length
  emailPattern = Validators.pattern(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i);
  numberPattern = Validators.pattern(/^[0-9]*$/);

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone
  ) {
    this.pessoaCadForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: ['', [Validators.required, this.numberPattern, Validators.maxLength(11), Validators.minLength(11)]],
      email: ['', [Validators.required, this.emailPattern]],
      dataNascimento: ['', [Validators.required]],
      imagem: [],
      urlImagem: []
    });
    this.telefonesForm = this.fb.group({
      ddd: ['', [this.numberPattern, Validators.required, Validators.maxLength(2), Validators.minLength(2)]],
      numero: ['', [this.numberPattern, Validators.required, Validators.maxLength(9), Validators.minLength(8)]]
    });

  }

  ngOnInit() {
    if (this.route.snapshot.params && this.route.snapshot.params.id) {
      const id = this.route.snapshot.params.id;
      this.isEdit = true;
      this.pageTitle = 'Atualizar Pessoa';
      this.pesquisarPorId(id);
    }
  }

  salvar() {
    const pessoa: Pessoa = this.pessoaCadForm.value;
    pessoa.telefones = this.pessoaSelecionada.telefones;
    pessoa.dataNascimento = this.getDateNascimentoFromComponent();
    return this.pessoaService.salvar(pessoa)
      .subscribe(pessoaSalva => {
        this.router.navigate(['/pessoa', {'nome': pessoaSalva.nome, 'cpf': pessoaSalva.cpf}]);
        return pessoaSalva;
      });
  }

  atualizar() {
    const pessoa: Pessoa = this.pessoaCadForm.value;
    pessoa.telefones = this.pessoaSelecionada.telefones;
    pessoa.id = this.pessoaSelecionada.id;
    pessoa.dataNascimento = this.getDateNascimentoFromComponent();
    this.pessoaService.atualizar(pessoa)
      .subscribe((pessoaAtualizada) => {
        this.router.navigate(['/pessoa', {'nome': pessoaAtualizada.nome, 'cpf': pessoaAtualizada.cpf}]);
      });
  }

  adicionarTelefone() {
    if (this.pessoaSelecionada) {
      const telefone: Telefone = this.telefonesForm.value;
      this.pessoaSelecionada.telefones.push(telefone);
      this.clearFormTelefone();
      }
  }

  removerTelefone(telefone: Telefone) {
    const index = this.pessoaSelecionada.telefones.indexOf(telefone);
    this.pessoaSelecionada.telefones.splice(index, 1);
  }

  clearFormTelefone(){
    this.telefonesForm.get('ddd').reset();
    this.telefonesForm.get('numero').reset();
  }

  private pesquisarPorId(id: string) {
    this.pessoaService.pesquisarPorId(id)
      .subscribe((p) => {
        const data = new Date(p.dataNascimento);

        this.pessoaCadForm.get('nome').setValue(p.nome);
        this.pessoaCadForm.get('cpf').setValue(p.cpf);
        this.pessoaCadForm.get('email').setValue(p.email);
        this.pessoaCadForm.get('dataNascimento').setValue(data);
        this.pessoaCadForm.get('imagem').setValue(p.imagem);
        this.pessoaCadForm.get('urlImagem').setValue(p.urlImagem);

        if (!this.pessoaSelecionada) {
          this.pessoaSelecionada = new Pessoa();
        }
        this.pessoaSelecionada.telefones = p.telefones;
        this.pessoaSelecionada.id = p.id;
      });
  }

  get urlUploadImagem() {
    return this.pessoaService.urlUploadAnexo();
  }

  afterEndUpload (event) {
    
    

    for (const file of event.files) {
       console.log('Nome:' + file.name);
       console.log('Url:' + file.URL);
        this.pessoaCadForm.patchValue({
          imagem: file.name
        });
      }
      
      

  }


  private getDateNascimentoFromComponent(): Date {
    return new Date(this.pessoaCadForm.get('dataNascimento').value.getTime());
  }


}
