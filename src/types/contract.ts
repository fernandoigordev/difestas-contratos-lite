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

  /** Se true, o PDF inclui Anexo I (orçamento detalhado) e Anexo II (comprovante de pagamento). */
  generateAttachments: boolean;
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
  generateAttachments: false,
};

export const EVENT_TYPE_SUGGESTIONS = [
  "Aniversário infantil",
  "Aniversário infantil (Smash the Cake / 1 aninho)",
  "Aniversário adulto",
  "Debutante (15 anos)",
  "Casamento",
  "Noivado",
  "Bodas (aniversário de casamento)",
  "Chá de bebê / revelação",
  "Chá de panela",
  "Chá bar / lingerie",
  "Baby shower",
  "Batizado",
  "Primeira comunhão / crisma",
  "Formatura",
  "Despedida de solteiro(a)",
  "Confraternização corporativa",
  "Lançamento de produto / evento corporativo",
  "Dia das Mães",
  "Dia dos Pais",
  "Páscoa",
  "Halloween",
  "Natal / Ano Novo",
];

export const PAYMENT_METHOD_SUGGESTIONS = ["PIX", "Transferência bancária", "Cartão de crédito", "Dinheiro"];
