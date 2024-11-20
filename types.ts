export interface Chat {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

export interface UserType {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  pin: number | null;
  language: string;
  isVerified: boolean;
  balance: number;
  image: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface Beneficiary {
  id: number;
  userid: string;
  acc_name: string;
  acc_num: string;
  avatar?: string;
  bank_name: string | null;
  bank_code: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: number;
  userid: string;
  sender: string;
  senderName: string;
  senderPic: string;
  receiver: string;
  receiverName: string;
  receiverPic: string;
  amount: number;
  refid: string;
  narration: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  isCredit: boolean;
}

export interface BookKeeping {
  id: string;
  amount: number;
  narration: string;
  date: string;
}

export interface NewTransactionType {
  beneficiaryId: string;
  name: string;
  amount: number;
  description: string;
}
