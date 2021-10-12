export interface Recibo{
    idUsuario?: string;
    nombreUsuario?: string;
    apellidoUsuario?: string;
    detalles?: string[];
    importes?: number[];
    total?: number;
    nroRecibo?: number;
}