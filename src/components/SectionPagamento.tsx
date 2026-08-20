import type { StepProps } from "./types";
import { PAYMENT_METHOD_SUGGESTIONS } from "@/types/contract";

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export default function SectionPagamento({ data, onChange }: StepProps) {
  const total = data.totalValue ?? 0;

  function handleDownPaymentChange(raw: string) {
    const value = raw === "" ? null : Number(raw);
    const patch: Partial<typeof data> = { downPayment: value };
    if (value != null && total > 0) {
      patch.downPaymentPercent = round2((value / total) * 100);
      patch.balanceValue = round2(Math.max(0, total - value));
    } else if (value != null) {
      patch.balanceValue = null;
    }
    onChange(patch);
  }

  function handlePercentChange(raw: string) {
    const percent = raw === "" ? null : Number(raw);
    const patch: Partial<typeof data> = { downPaymentPercent: percent };
    if (percent != null && total > 0) {
      const value = round2((total * percent) / 100);
      patch.downPayment = value;
      patch.balanceValue = round2(Math.max(0, total - value));
    }
    onChange(patch);
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Pagamento</h2>

      {total === 0 && (
        <p className="text-xs text-amber-700 bg-amber-50 ring-1 ring-amber-200 rounded-lg px-3 py-2">
          Defina o valor total na etapa anterior para calcular o saldo automaticamente.
        </p>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Entrada/reserva (R$)</label>
          <input
            className="field-input"
            type="number"
            min={0}
            step="0.01"
            value={data.downPayment ?? ""}
            onChange={(e) => handleDownPaymentChange(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label">Entrada (%)</label>
          <input
            className="field-input"
            type="number"
            min={0}
            max={100}
            step="0.1"
            value={data.downPaymentPercent ?? ""}
            onChange={(e) => handlePercentChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="field-label">Saldo</label>
        <input
          className="field-input bg-gray-50"
          type="number"
          value={data.balanceValue ?? ""}
          readOnly
        />
      </div>

      <div>
        <label className="field-label">Vencimento do saldo</label>
        <input
          className="field-input"
          type="date"
          value={data.balanceDueDate}
          onChange={(e) => onChange({ balanceDueDate: e.target.value })}
        />
      </div>

      <div>
        <label className="field-label">Forma de pagamento</label>
        <input
          className="field-input"
          list="payment-method-suggestions"
          value={data.paymentMethod}
          onChange={(e) => onChange({ paymentMethod: e.target.value })}
        />
        <datalist id="payment-method-suggestions">
          {PAYMENT_METHOD_SUGGESTIONS.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Data do pagamento da entrada</label>
          <input
            className="field-input"
            type="date"
            value={data.downPaymentDate}
            onChange={(e) => onChange({ downPaymentDate: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label">Comprovante/identificação</label>
          <input
            className="field-input"
            placeholder="Ex.: ID da transação PIX"
            value={data.paymentProofReference}
            onChange={(e) => onChange({ paymentProofReference: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
