import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';

import { Message } from '../models/message';
import { Reserva } from '../models/reservas';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {

  private baseUrl = 'http://localhost:8080/api/reservas';

  constructor(private http: HttpClient) { }

  /**
   * Do a posting 
   * @param reserva
   */
  createReserva(reserva: Reserva): Observable<Message> {
      return this.http.post<Message>(`${this.baseUrl}` + `/create`, reserva)
                  .pipe(
                    retry(3),
                    catchError(this.handleError)
                  );
  }

  updateReserva(reserva: Reserva): Observable<Message> {
      return this.http.put<Message> (`${this.baseUrl}` + `/update/` + reserva.id, reserva)
        .pipe(
            retry(3),
            catchError(this.handleError)
          );
  }

  deleteReserva(id: number): Observable<Message> {
      return this.http.delete<Message>(`${this.baseUrl}` + `/delete/` + id)
            .pipe(
              retry(3),
              catchError(this.handleError)  
            );
  }

  retrieveAllReserva(): Observable<Message> {
      return this.http.get<Message>(`${this.baseUrl}` + `/findall`)
                    .pipe(
                      retry(3),
                      catchError(this.handleError)
                    );
  }

  retrieveReserva(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.baseUrl}` + `/findbyid/` + id)
                  .pipe(
                    retry(3),
                    catchError(this.handleError)
                  );
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  };
}
