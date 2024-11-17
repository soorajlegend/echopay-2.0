import { Beneficiary, Transaction } from "./types";

// owner of the information
export const owner = {
  id: 2,
  fullname: "suraj muhammad",
  phone: "08082905659",
  pin: null,
  balance: "23430.00",
  image: null,
  status: null,
  language: "PG",
  isVerified: false,
  createdAt: "2024-11-17T14:41:46.000Z",
  updatedAt: "2024-11-17T14:41:46.000Z",
};

// beneficiaries
export const beneficiaries: Beneficiary[] = [
  {
    id: 1,
    userid: "2",
    acc_name: "Faruq Hassan",
    acc_num: "08114528984",
    bank_name: "",
    bank_code: "",
    status: 0,
    createdAt: "2024-11-17T15:14:46.000Z",
    updatedAt: "2024-11-17T15:14:46.000Z",
  },
  {
    id: 3,
    userid: "user2",
    acc_name: "Salma Gambo",
    acc_num: "0987654321",
    bank_name: "Chase Bank",
    bank_code: "CHASE001",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    userid: "user3",
    acc_name: "Muhammad Ali",
    acc_num: "5555555555",
    bank_name: "Wells Fargo",
    bank_code: "WF001",
    status: 1,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
];

// create a realistic dummy data of business and personal finances ranging  from September to 17th November 2024, this would be used as the user's transaction history
// transactions
export const transactions: Transaction[] = [
 
];
