import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';

import { ReservasService } from 'src/app/shared/services/reservas.service';
import { ValidarCamposService } from 'src/app/shared/components/campos/validar-campos.service';
import { Reserva } from 'src/app/shared/models/reservas';
import { Alerta } from 'src/app/shared/models/alerta';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';

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
  timeS: Array<string> = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00'
  ];
  timeE: Array<string> = [
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00'
  ]
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
    this.reservaService.createReserva(reserva).subscribe(() => {
      const config = {
        data: {
          titulo: 'Sucesso!',
          descricao: 'Reserva cadastrada com sucesso no banco de dados.',
          btnSucesso: 'Ir para listagem',
          btnCancelar: 'Cadastrar nova reserva',
          corBtnCancelar: 'primary',
          possuirBtnFechar: true
        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe((opcao: boolean) => {
        if(opcao){
          this.router.navigateByUrl('home');
        } else {
          this.criarFormulario(this.criarReservaEmBranco());
        }
      });
    },
    () => {
      const config = {
        data: {
          titulo: 'Erro ao salvar o registro!',
          descricao: 'Não foi possivel salvar seu registro, favor tentar novamente',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
  }

  onCancel(){
    if(this.id){
      this.router.navigateByUrl('/home');
    } else {
      this.cadastro.reset;
    }
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
      segundoNome: [reserva.segundoNome, [Validators.minLength(0), Validators.maxLength(256)]],
      email: [reserva.email, [Validators.required, Validators.email, Validators.minLength(2), Validators.maxLength(256)]],
      qtdePessoas: [reserva.qtdePessoas, [Validators.required, Validators.min(1), Validators.max(10)]],
      dtChegada: [reserva.dtChegada, [Validators.required]],
      timeChegada: [reserva.timeChegada, [Validators.required]],
      dtSaida: [reserva.dtSaida, [Validators.required]],
      timeSaida: [reserva.timeSaida, [Validators.required]],
      transpGratis: [reserva.transpGratis, [Validators.required]],
      codigoVoo: [reserva.codigoVoo, [Validators.minLength(0), Validators.maxLength(6)]],
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
    this.reservaService.updateReserva(reserva).subscribe(() => {
      const config = {
        data: {
          titulo: 'Sucesso!',
          descricao: 'Reserva atualizada com sucesso no banco de dados.',
          btnSucesso: 'Ir para listagem',
        } as Alerta
      };
      const dialogRef = this.dialog.open(AlertaComponent, config);
      dialogRef.afterClosed().subscribe((opcao: boolean) => {
        if(opcao){
          this.router.navigateByUrl('home');
        }
      });
    },
    () => {
      const config = {
        data: {
          titulo: 'Erro ao atualizar o registro!',
          descricao: 'Não foi possivel atualizar seu registro, favor tentar novamente',
          corBtnSucesso: 'warn',
          btnSucesso: 'Fechar'
        } as Alerta
      };
      this.dialog.open(AlertaComponent, config);
    });
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
