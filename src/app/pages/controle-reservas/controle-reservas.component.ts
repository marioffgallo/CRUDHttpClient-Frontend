import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertaComponent } from 'src/app/shared/components/alerta/alerta.component';
import { ResumeComponent } from 'src/app/shared/components/resume/resume.component';
import { Alerta } from 'src/app/shared/models/alerta';
import { Reserva } from 'src/app/shared/models/reservas';
import { ReservasService } from 'src/app/shared/services/reservas.service';

@Component({
  selector: 'app-controle-reservas',
  templateUrl: './controle-reservas.component.html',
  styleUrls: ['./controle-reservas.component.css']
})
export class ControleReservasComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'dtChegada', 'dtSaida', 'status', 'actions'];
  reservas: Observable<any>;

  dataSource = new MatTableDataSource<Reserva>();
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog,
              public router: Router,
              private reservasService: ReservasService) { }

  ngOnInit(): void {
    this.reservas = this.reservasService.retrieveAllReserva();
    this.getAllReservas();
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  btnDelete(id: number) {
    const config = {
      data: {
        titulo: 'Você tem certeza que deseja excluir?',
        descricao: 'Caso você tenha certeza que deseja excluir, clique no botão OK',
        corBtnCancelar: 'primary',
        corBtnSucesso: 'warn',
        possuirBtnFechar: true
      } as Alerta
    };
    const dialogRef = this.dialog.open(AlertaComponent, config);
    dialogRef.afterClosed().toPromise().then((opcao: boolean) => {
      if(opcao) {
        this.reservasService.deleteReserva(id).subscribe(() => {
          const configDelete = {
            data: {
              titulo: 'Sucesso!',
              descricao: 'Registro deletado com exito.',
              corBtnSucesso: 'primary'
            } as Alerta
          };
          this.dialog.open(AlertaComponent, configDelete).afterClosed().subscribe(() =>{
            this.getAllReservas();
          });
        }, error => {
          console.log(error);
          const configDeleteError = {
            data: {
              titulo: 'Falha!',
              descricao: 'Houve um erro ao deletar o registro, favor tentar novamente.',
              corBtnSucesso: 'primary'
            } as Alerta
          };
          this.dialog.open(AlertaComponent, configDeleteError);
        })
      }
    })
  }

  openResume(element: any){
    this.dialog.open(ResumeComponent, {                  
      width: 'auto',
      height: 'auto',
      data: element
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

  doFilter(search = ''){
    this.dataSource.filter = search.toLocaleLowerCase().trim();
  }

  resetFilter(){
    this.dataSource.filter = '';
  }

  public customSort = (event: any) => {
    console.log(event);
  }

  public getAllReservas = () => {
    this.reservasService.retrieveAllReserva()
    .subscribe(res => {
      this.dataSource.data = res as Reserva[];
    })
  }
}