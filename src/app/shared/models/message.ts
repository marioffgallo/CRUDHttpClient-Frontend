import { Reserva } from './reservas';

export class Message {
    message!: string;
    error!: string;
    reserva?: Reserva;
}