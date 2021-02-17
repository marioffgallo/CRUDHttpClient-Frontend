import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../shared/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CamposModule } from '../shared/components/campos/campos.module';
import { CadastroReservasComponent } from './cadastro-reservas/cadastro-reservas.component';
import { ControleReservasComponent } from './controle-reservas/controle-reservas.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    CamposModule
  ],
  declarations: [CadastroReservasComponent, ControleReservasComponent]
})
export class PagesModule { }
