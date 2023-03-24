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

export interface Transactions {
    id: number;
    fromAccount: {
      number: string;
      owner: {
        firstName: string;
        lastName: string;
      }
    };
    toAccount: {
      number: string;
      owner: {
        firstName: string;
        lastName: string;
      }
    };
    amount: number;
    type: string;
    createdAt: Date;
  };
