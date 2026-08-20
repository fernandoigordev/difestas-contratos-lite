import contractTemplate from "../../templates/contract-template.html?raw";
import { renderTemplate } from "./template-engine";
import { formatCurrencyBRL, valorPorExtenso } from "./extenso";
import { formatDateBR, formatDateExtendedBR } from "./format";
import { COMPANY_CONFIG } from "../config";
import type { ContractFormData } from "@/types/contract";

function buildTemplateContext(data: ContractFormData): Record<string, unknown> {
  const includedItems = data.includedItems.map((item) => ({
    description: item.description,
    quantityLabel: item.quantity ? String(item.quantity) : "",
    valueLabel: item.value !== null && item.value !== undefined ? formatCurrencyBRL(item.value) : "",
  }));

  return {
    companyName: COMPANY_CONFIG.name,
    companyAddress: COMPANY_CONFIG.address,
    companyRepresentativeName: COMPANY_CONFIG.representativeName,
    companyRepresentativeCpf: COMPANY_CONFIG.representativeCpf,

    clientName: data.clientName,
    clientCpf: data.clientCpf,
    clientRg: data.clientRg,
    clientNationality: data.clientNationality,
    clientMaritalStatus: data.clientMaritalStatus,
    clientAddress: data.clientAddress,
    clientCityUf: data.clientCityUf,
    clientCep: data.clientCep,
    clientPhone: data.clientPhone,
    clientEmail: data.clientEmail,

    eventType: data.eventType,
    eventTheme: data.eventTheme,
    eventDateFormatted: formatDateBR(data.eventDate),
    eventStartTime: data.eventStartTime,
    eventEndTime: data.eventEndTime,
    eventLocation: data.eventLocation,

    includedItems,
    excludedItems: data.excludedItems,
    totalValueFormatted: formatCurrencyBRL(data.totalValue),
    totalValueExtenso: data.totalValueExtenso || (data.totalValue != null ? valorPorExtenso(data.totalValue) : ""),

    downPaymentFormatted: formatCurrencyBRL(data.downPayment),
    downPaymentPercentFormatted: data.downPaymentPercent != null ? `${data.downPaymentPercent}%` : "",
    balanceValueFormatted: formatCurrencyBRL(data.balanceValue),
    balanceDueDateFormatted: formatDateBR(data.balanceDueDate),
    paymentMethod: data.paymentMethod,
    downPaymentDateFormatted: formatDateBR(data.downPaymentDate),
    paymentProofReference: data.paymentProofReference,

    imageAuthorization: Boolean(data.imageAuthorization),

    signatureCity: data.signatureCity,
    contractDateFormatted: formatDateExtendedBR(data.contractDate || new Date().toISOString().slice(0, 10)),
    observations: data.observations,
  };
}

export function renderContractHtml(data: ContractFormData): string {
  const context = buildTemplateContext(data);
  return renderTemplate(contractTemplate, context);
}

/**
 * Abre o contrato preenchido numa nova aba já pronta para impressão — a
 * pessoa escolhe "Salvar como PDF" no diálogo de impressão do navegador.
 * Evita depender de bibliotecas de geração de PDF no navegador.
 */
export function openContractForPrint(data: ContractFormData): void {
  const html = renderContractHtml(data);
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, "_blank");

  if (!printWindow) {
    URL.revokeObjectURL(url);
    alert(
      "Não foi possível abrir a janela de impressão. Verifique se o navegador está bloqueando pop-ups para este site."
    );
    return;
  }

  printWindow.addEventListener("load", () => {
    printWindow.focus();
    printWindow.print();
  });

  // Libera o objeto Blob depois de um tempo (a aba já terá carregado o conteúdo).
  setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
