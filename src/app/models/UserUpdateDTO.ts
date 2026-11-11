export class UserUpdateDTO {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string | null = null;    // opcional: si va vacío, no se cambia
  phone: string = '';
  birthDate: string | null = null;   // formato "yyyy-MM-dd"
  gender: string = '';
}