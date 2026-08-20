export interface ContractItem {
  description: string;
  quantity?: number | null;
  value?: number | null;
}

export interface ExcludedItem {
  description: string;
}

/** Dados editáveis do formulário (sem id/timestamps). */
export interface ContractFormData {
  clientName: string;
  clientCpf: string;
  clientRg: string;
  clientNationality: string;
  clientMaritalStatus: string;
  clientAddress: string;
  clientCityUf: string;
  clientCep: string;
  clientPhone: string;
  clientEmail: string;

  eventType: string;
  eventTheme: string;
  eventDate: string;
  eventStartTime: string;
  eventEndTime: string;
  eventLocation: string;

  includedItems: ContractItem[];
  excludedItems: ExcludedItem[];
  totalValue: number | null;
  totalValueExtenso: string;

  downPayment: number | null;
  downPaymentPercent: number | null;
  balanceValue: number | null;
  balanceDueDate: string;
  paymentMethod: string;
  downPaymentDate: string;
  paymentProofReference: string;

  imageAuthorization: boolean | null;

  signatureCity: string;
  contractDate: string;
  observations: string;
}

/** Registro salvo no banco local (SQLite via sql.js). */
export interface ContractRecord extends ContractFormData {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const EMPTY_CONTRACT_FORM: ContractFormData = {
  clientName: "",
  clientCpf: "",
  clientRg: "",
  clientNationality: "brasileira",
  clientMaritalStatus: "",
  clientAddress: "",
  clientCityUf: "",
  clientCep: "",
  clientPhone: "",
  clientEmail: "",
  eventType: "",
  eventTheme: "",
  eventDate: "",
  eventStartTime: "",
  eventEndTime: "",
  eventLocation: "",
  includedItems: [],
  excludedItems: [],
  totalValue: null,
  totalValueExtenso: "",
  downPayment: null,
  downPaymentPercent: null,
  balanceValue: null,
  balanceDueDate: "",
  paymentMethod: "",
  downPaymentDate: "",
  paymentProofReference: "",
  imageAuthorization: null,
  signatureCity: "",
  contractDate: "",
  observations: "",
};

export const EVENT_TYPE_SUGGESTIONS = [
  "Aniversário infantil",
  "Debutante (15 anos)",
  "Casamento",
  "Chá de bebê / revelação",
  "Formatura",
  "Confraternização corporativa",
  "Batizado",
  "Noivado",
];

export const PAYMENT_METHOD_SUGGESTIONS = ["PIX", "Transferência bancária", "Cartão de crédito", "Dinheiro"];
