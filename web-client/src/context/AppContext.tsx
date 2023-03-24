import React, {
  ReactNode,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import axios from "axios";
import { User, CreateUser, LoginUser, Transactions } from "../types";

type AppContextType = {
  isUserLoggedIn: boolean;
  accessToken: string | null;
  user: User | null;
  createUser: (user: CreateUser) => void;
  loginUser: (user: LoginUser) => void;
  fundAccount: (amount: number) => void;
  fetchTransactions: () => void;
  transactions: Transactions[];
  transferFunds: (amount: number, toAccount: string) => void;
};

const apiBaseUrl = "http://localhost:9200";

const AppContext = React.createContext<AppContextType>({
  isUserLoggedIn: false,
  accessToken: null,
  user: null,
  createUser: () => {},
  loginUser: () => {},
  fundAccount: () => {},
  fetchTransactions: () => {},
  transactions: [],
  transferFunds: () => {},
});

export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const isUserLoggedIn = useMemo(() => !!user, [user]);
  const [transactions, setTransactions] = useState<Transactions[]>([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    const user = localStorage.getItem("user");
    if (accessToken && user) {
      setAccessToken(accessToken);
      setUser(JSON.parse(user));
    }
  }, []);

  const createUser = useCallback(async (payload: CreateUser) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/user`, payload);
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAccessToken(response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw new Error("An error occured");
    }
  }, []);


  const loginUser = useCallback(async (payload: LoginUser) => {
    try {
      const response = await axios.post(`${apiBaseUrl}/user/login`, payload);
      localStorage.setItem("accessToken", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setAccessToken(response.data.token);
      setUser(response.data.user);
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  }, []);

  const fundAccount = useCallback(async (amount: number) => {
    try {
      await axios.post(`${apiBaseUrl}/account/deposit`, {
        amount
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
       });
       const updatedUser = {
        ...user!,
        account: {
          ...user!.account,
          balance: user!.account.balance + amount,
        }
      }
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      throw new Error("An error occured");
    }
  }, [accessToken, user]);

  const fetchTransactions = useCallback(async () => {
    try {
      const response = await axios.get(`${apiBaseUrl}/transaction/history`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      throw new Error("An error occured");
    }
  }, [accessToken]);

  const transferFunds = useCallback(async (amount: number, accountNumber: string) => {
    try {
      await axios.post(`${apiBaseUrl}/transaction/transfer`, {
        amount,
        accountNumber,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const updatedUser = {
        ...user!,
        account: {
          ...user!.account,
          balance: user!.account.balance - amount,
        }
      }
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (error) {
      throw new Error("An error occured");
    }
  }, [accessToken, user]);


  return (
    <AppContext.Provider value={{
        user,
        createUser,
        isUserLoggedIn,
        accessToken,
        loginUser,
        fundAccount,
        fetchTransactions,
        transactions,
        transferFunds,
      }}>
      {children}
    </AppContext.Provider>
  );
};
