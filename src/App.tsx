import { useEffect, useState } from "react";
import { initDb } from "@/db/database";
import ContractList from "@/components/ContractList";
import ContractForm from "@/components/ContractForm";
import BackupControls from "@/components/BackupControls";
import { EMPTY_CONTRACT_FORM, type ContractFormData, type ContractRecord } from "@/types/contract";

type View =
  | { name: "list" }
  | { name: "form"; editingId: string | null; initialData: ContractFormData; isEdit: boolean };

/** Extrai só os campos editáveis do formulário a partir de um registro salvo (usado ao duplicar). */
function toFormData(record: ContractRecord): ContractFormData {
  const { id: _id, createdAt: _createdAt, updatedAt: _updatedAt, ...formData } = record;
  return formData;
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);
  const [view, setView] = useState<View>({ name: "list" });
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    initDb()
      .then(() => setReady(true))
      .catch((err) => {
        console.error(err);
        setDbError("Não foi possível iniciar o banco de dados local neste navegador.");
      });
  }, []);

  if (dbError) {
    return <div className="app-loading">{dbError}</div>;
  }

  if (!ready) {
    return <div className="app-loading">Carregando...</div>;
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <h1>DI Festas e Decorações</h1>
          <p className="subtitle">
            {view.name === "form" ? (view.isEdit ? "Editar contrato" : "Novo contrato") : "Contratos gerados"}
          </p>
        </div>
        {view.name === "form" && (
          <button type="button" className="btn-ghost" onClick={() => setView({ name: "list" })}>
            Voltar
          </button>
        )}
      </header>

      <main className="app-main">
        {view.name === "list" ? (
          <>
            <BackupControls onImported={() => setRefreshKey((k) => k + 1)} />
            <ContractList
              refreshKey={refreshKey}
              onNew={() =>
                setView({ name: "form", editingId: null, initialData: EMPTY_CONTRACT_FORM, isEdit: false })
              }
              onEdit={(record) =>
                setView({ name: "form", editingId: record.id, initialData: toFormData(record), isEdit: true })
              }
              onDuplicate={(record) =>
                setView({ name: "form", editingId: null, initialData: toFormData(record), isEdit: false })
              }
              onChanged={() => setRefreshKey((k) => k + 1)}
            />
          </>
        ) : (
          <ContractForm
            initialData={view.initialData}
            editingId={view.editingId}
            onCancel={() => setView({ name: "list" })}
            onSaved={() => {
              setRefreshKey((k) => k + 1);
              setView({ name: "list" });
            }}
          />
        )}
      </main>
    </div>
  );
}
