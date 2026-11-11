export class UserDTO {
  userId: number = 0;
  username: string = '';
  roleId: number = 0;
  roleName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phone: string = '';
  birthDate: string | null = null;   // "2001-02-11"
  gender: string = '';
  accountStatus: string = '';        // "ACTIVO" o "INACTIVO"
}
