import { useEffect, useState } from "react";
import { deleteContract, listContracts } from "@/db/database";
import { openContractForPrint } from "@/lib/pdf";
import { formatDateBR } from "@/lib/format";
import type { ContractRecord } from "@/types/contract";

interface ContractListProps {
  refreshKey: number;
  onNew: () => void;
  onEdit: (record: ContractRecord) => void;
  onDuplicate: (record: ContractRecord) => void;
  onChanged: () => void;
}

export default function ContractList({ refreshKey, onNew, onEdit, onDuplicate, onChanged }: ContractListProps) {
  const [search, setSearch] = useState("");
  const [contracts, setContracts] = useState<ContractRecord[]>([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  useEffect(() => {
    setContracts(listContracts(search));
  }, [search, refreshKey]);

  async function handleDelete(id: string) {
    await deleteContract(id);
    setConfirmDeleteId(null);
    setContracts(listContracts(search));
    onChanged();
  }

  return (
    <div>
      <div className="search-bar">
        <input
          className="field-input"
          placeholder="Buscar por nome, evento ou local..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {contracts.length === 0 ? (
        <div className="empty-state">
          {search
            ? "Nenhum contrato encontrado para essa busca."
            : "Nenhum contrato cadastrado ainda. Toque no + para criar o primeiro."}
        </div>
      ) : (
        <div className="contract-list">
          {contracts.map((c) => (
            <div className="contract-item" key={c.id}>
              <p className="name">{c.clientName || "(sem nome)"}</p>
              <p className="meta">
                {[c.eventType, c.eventDate ? formatDateBR(c.eventDate) : null].filter(Boolean).join(" · ") ||
                  "Sem dados do evento"}
                {" — "}
                atualizado em {formatDateBR(c.updatedAt.slice(0, 10))}
              </p>

              {confirmDeleteId === c.id ? (
                <div className="actions">
                  <span className="text-xs text-rose-600" style={{ alignSelf: "center" }}>
                    Excluir este contrato?
                  </span>
                  <button type="button" className="btn-danger" onClick={() => handleDelete(c.id)}>
                    Confirmar exclusão
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => setConfirmDeleteId(null)}>
                    Cancelar
                  </button>
                </div>
              ) : (
                <div className="actions">
                  <button type="button" className="btn-secondary" onClick={() => onEdit(c)}>
                    Editar
                  </button>
                  <button type="button" className="btn-secondary" onClick={() => openContractForPrint(c)}>
                    Gerar PDF
                  </button>
                  <button type="button" className="btn-ghost" onClick={() => onDuplicate(c)}>
                    Duplicar
                  </button>
                  <button type="button" className="btn-danger" onClick={() => setConfirmDeleteId(c.id)}>
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <button type="button" className="fab" onClick={onNew} aria-label="Novo contrato">
        +
      </button>
    </div>
  );
}
