export interface Reserva {
    id?: number;
    primeiroNome?: string;
    segundoNome?: string;
    email?: string;
    qtdePessoas?: number;
    dtChegada?: Date;
    timeChegada?: string;
    dtSaida?: Date;
    timeSaida?: string;
    transpGratis?: string;
    codigoVoo?: string;
    reqEspeciais?: string;
    status?: string;
}