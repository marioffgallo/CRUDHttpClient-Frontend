import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ReservasService } from 'src/app/shared/services/reservas.service';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Reserva } from 'src/app/shared/models/reservas';
import { Message } from 'src/app/shared/models/message';

@Component({
  selector: 'app-cadastro-reservas',
  templateUrl: './cadastro-reservas.component.html',
  styleUrls: ['./cadastro-reservas.component.css']
})
export class CadastroReservasComponent implements OnInit {

  id: number;
  reserva: Reserva;
  cadastro: FormGroup;
  situacao: Array<string> = [
    'Aberto',
    'Cancelada',
    'Fechada'
  ];
  time: Array<string>;
  resposta: Array<string> = [
    'Sim, me busque no aeroporto',
    'Não, eu encontro meu caminho'
  ];
  minDate= new Date();


  /**
   * Constructing Http Service
   * @param reservaService 
   */

  constructor(public validacao: ValidarCamposService,
              public dialog: MatDialog,
              private fb: FormBuilder,
              private reservaService: ReservasService,
              private router: Router,
              private activatedRoute: ActivatedRoute) { }

  get f() {
    return this.cadastro.controls;
  }

  ngOnInit(): void {
    this.time = [
      '08:00',
      '09:00',
      '10'
    ]

    this.id = this.activatedRoute.snapshot.params['id'];
    if(this.id) {
      this.reservaService.retrieveReserva(this.id)
      .subscribe((reserva: Reserva) => this.criarFormulario(reserva));
    } else {
      this.criarFormulario(this.criarReservaEmBranco());
    }

    this.criarFormulario(this.criarReservaEmBranco());
  }

  save(reserva: Reserva) {
    this.reservaService.createReserva(reserva)
          .subscribe((message: Message) => {
            console.log(message);
            console.log("Reserva cadastrada com sucesso no banco de dados!");
          }, error => {
            console.log(error);
            console.log("Ocorreu um erro ao tentar salvar no banco de dados.")
          });
    this.cadastro.reset();
  }

  reset(){
    this.cadastro.reset;
  }

  onSubmit() {
    this.cadastro.markAllAsTouched();
    
    if(this.cadastro.invalid){
      return;
    }

    const reserva = this.cadastro.getRawValue() as Reserva;

    if(this.id){
      reserva.id = this.id;
      this.editar(reserva);
    } else {
    this.save(reserva);
    }
  }

  private criarFormulario(reserva: Reserva): void {
    this.cadastro = this.fb.group({
      primeiroNome: [reserva.primeiroNome, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      segundoNome: [reserva.segundoNome, [Validators.required, Validators.minLength(2), Validators.maxLength(256)]],
      email: [reserva.email, [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(256)]],
      qtdePessoas: [reserva.qtdePessoas, [Validators.required, Validators.min(1), Validators.max(10)]],
      dtChegada: [reserva.dtChegada, [Validators.required]],
      timeChegada: [reserva.timeChegada, [Validators.required]],
      dtSaida: [reserva.dtSaida, [Validators.required]],
      timeSaida: [reserva.timeSaida, [Validators.required]],
      transpGratis: [reserva.transpGratis, [Validators.required]],
      codigoVoo: [reserva.codigoVoo, [Validators.required]],
      reqEspeciais: [reserva.reqEspeciais, [Validators.max(1200)]],
      status: [reserva.status, [Validators.required]]
    }, { validators: this.dateLessThan('dtChegada', 'dtSaida') });
  }

  private criarReservaEmBranco(): Reserva{
    return {
      id: null,
      primeiroNome: null,
      segundoNome: null,
      email: null,
      qtdePessoas: null,
      dtChegada: null,
      timeChegada: null,
      dtSaida: null,
      timeSaida: null,
      transpGratis: null,
      codigoVoo: null,
      reqEspeciais: null,
      status: 'Aberto'
    } as Reserva;
  }

  editar(reserva: Reserva){
    this.reservaService.updateReserva(reserva).subscribe((message: Message) => {
      console.log(message);
      console.log('Registro atualizado com sucesso.');
    }, error => {
      console.log(error);
      console.log('Ocorreu um erro na atualização.');
    })
    this.router.navigateByUrl('/home');
  }

  dateLessThan(from: string, to: string) {
    return (group: FormGroup): {[key: string]: any} => {
      let f = group.controls[from];
      let t = group.controls[to];
      if (f.value >= t.value) {
        return {
          dates: "Partida não deve ser igual a Chegada"          
        };
      }
      return {};
    }
  }
}
