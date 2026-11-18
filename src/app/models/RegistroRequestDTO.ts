export class RegistroRequestDTO {
  username: string = '';
  rolId: number = 0;
  nombres: string = '';
  apellidos: string = '';
  correoElectronico: string = '';
  contrasena: string = '';
  telefono: string = '';
  fechaNacimiento: string = '';
  genero: string = '';
  numeroColegiatura: string | null = null;
  especializacion: string | null = null;
  anosExperiencia: number | null = null;
}
