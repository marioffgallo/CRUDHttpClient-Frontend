import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ReservasService } from 'src/app/shared/services/reservas.service';

@Component({
  selector: 'app-controle-reservas',
  templateUrl: './controle-reservas.component.html',
  styleUrls: ['./controle-reservas.component.css']
})
export class ControleReservasComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'dtChegada', 'dtSaida', 'status', 'actions'];
  reservas: Observable<any>;
  
  constructor(private reservasService: ReservasService,
              private fb: FormBuilder,
              private router: Router) { }

  ngOnInit(): void {
    this.reservas = this.reservasService.retrieveAllReserva();
  }

  delete(id: number) {
    this.reservasService.deleteReserva(id).subscribe(() => {
      console.log("Reserva deletada com sucesso no banco de dados!");
      this.router.navigateByUrl('/home');
    }, error => {
      console.log(error);
      console.log("Ocorreu um erro ao tentar deletar no banco de dados.");
    }); 
  }

  edit(id: number): void {
    this.router.navigateByUrl('/cadastro/' + id);
  }

  checkStatus(status: string): boolean{
    if(status != 'Aberto'){
      return true;
    } else {
      return false;
    }
  }
}