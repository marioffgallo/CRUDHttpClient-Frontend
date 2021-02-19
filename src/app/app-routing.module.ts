import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CadastroReservasComponent } from './pages/cadastro-reservas/cadastro-reservas.component';
import { ControleReservasComponent } from './pages/controle-reservas/controle-reservas.component';

const routes: Routes = [
  {
    path: 'cadastro',
    children: [
      {
        path: '',
        component: CadastroReservasComponent
      },
      {
        path: ':id',
        component: CadastroReservasComponent
      }
    ]
  },
  {
    path: 'home',
    component: ControleReservasComponent,
  },
  {
    path: '',
    component: ControleReservasComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
