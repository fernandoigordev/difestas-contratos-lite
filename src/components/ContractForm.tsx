import { useState } from "react";
import SectionContratante from "./SectionContratante";
import SectionEvento from "./SectionEvento";
import SectionOrcamento from "./SectionOrcamento";
import SectionPagamento from "./SectionPagamento";
import SectionFinalizacao from "./SectionFinalizacao";
import { createContract, updateContract } from "@/db/database";
import { openContractForPrint } from "@/lib/pdf";
import type { ContractFormData, ContractRecord } from "@/types/contract";

interface ContractFormProps {
  /** Dados iniciais do formulário (contrato existente, cópia de duplicação, ou o formulário vazio). */
  initialData: ContractFormData;
  /** id do contrato a atualizar, ou null para criar um contrato novo (inclusive ao duplicar). */
  editingId: string | null;
  onCancel: () => void;
  onSaved: (record: ContractRecord) => void;
}

function requiredFieldsMissing(data: ContractFormData): string[] {
  const missing: string[] = [];
  if (!data.clientName.trim()) missing.push("nome do contratante");
  if (!data.clientAddress.trim()) missing.push("endereço do contratante");
  if (!data.eventType.trim()) missing.push("tipo de evento");
  if (!data.eventDate.trim()) missing.push("data do evento");
  if (!data.eventLocation.trim()) missing.push("local do evento");
  if (data.totalValue === null || data.totalValue === undefined) missing.push("valor total");
  return missing;
}

export default function ContractForm({ initialData, editingId, onCancel, onSaved }: ContractFormProps) {
  const [data, setData] = useState<ContractFormData>(initialData);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(patch: Partial<ContractFormData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  async function persist(): Promise<ContractRecord> {
    if (editingId) {
      return updateContract(editingId, data);
    }
    return createContract(data);
  }

  async function handleSave() {
    setError(null);
    setSaving(true);
    try {
      const saved = await persist();
      onSaved(saved);
    } catch (err) {
      console.error(err);
      setError("Não foi possível salvar o contrato. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveAndPrint() {
    setError(null);
    const missing = requiredFieldsMissing(data);
    if (missing.length > 0) {
      setError(`Preencha antes de gerar o PDF: ${missing.join(", ")}.`);
      return;
    }
    setSaving(true);
    try {
      const saved = await persist();
      openContractForPrint(saved);
      onSaved(saved);
    } catch (err) {
      console.error(err);
      setError("Não foi possível salvar/gerar o contrato. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="section-card">
        <SectionContratante data={data} onChange={handleChange} />
      </div>
      <div className="section-card">
        <SectionEvento data={data} onChange={handleChange} />
      </div>
      <div className="section-card">
        <SectionOrcamento data={data} onChange={handleChange} />
      </div>
      <div className="section-card">
        <SectionPagamento data={data} onChange={handleChange} />
      </div>
      <div className="section-card">
        <SectionFinalizacao data={data} onChange={handleChange} />
      </div>

      {error && (
        <p className="text-xs text-rose-600" style={{ marginBottom: 12 }}>
          {error}
        </p>
      )}

      <div className="action-bar">
        <button type="button" className="btn-ghost" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
        <button type="button" className="btn-secondary" onClick={handleSave} disabled={saving}>
          {saving ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" className="btn-primary" onClick={handleSaveAndPrint} disabled={saving}>
          {saving ? "Aguarde..." : "Salvar e gerar PDF"}
        </button>
      </div>
    </div>
  );
}
