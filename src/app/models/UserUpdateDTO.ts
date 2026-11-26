export class UserUpdateDTO {
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string | null = null;
  phone: string = '';
  birthDate: string | null = null;
  gender: string = '';
}