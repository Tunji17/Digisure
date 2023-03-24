export interface LoginUser {
  email: string;
  password: string;
}

export interface CreateUser extends LoginUser {
  firstName: string;
  lastName: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  account: {
    number: string;
    balance: number;
  }
}