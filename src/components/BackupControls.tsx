import { useRef, useState, type ChangeEvent } from "react";
import { exportDatabaseFile, importDatabaseFile } from "@/db/database";

interface BackupControlsProps {
  onImported: () => void;
}

function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

function backupFileName(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${pad2(now.getMonth() + 1)}${pad2(now.getDate())}-${pad2(
    now.getHours()
  )}${pad2(now.getMinutes())}`;
  return `difestas-contratos-backup-${stamp}.sqlite`;
}

export default function BackupControls({ onImported }: BackupControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [confirmingImport, setConfirmingImport] = useState(false);

  function handleExport() {
    const bytes = exportDatabaseFile();
    const blob = new Blob([bytes], { type: "application/x-sqlite3" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = backupFileName();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    setMessage("Backup baixado.");
    window.setTimeout(() => setMessage(null), 4000);
  }

  function handleImportClick() {
    setConfirmingImport(true);
  }

  function handleFileChosen(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    setConfirmingImport(false);
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const bytes = new Uint8Array(reader.result as ArrayBuffer);
        await importDatabaseFile(bytes);
        setMessage("Backup restaurado com sucesso.");
        onImported();
      } catch (err) {
        console.error(err);
        setMessage("Não foi possível importar esse arquivo. Verifique se é um backup válido (.sqlite).");
      } finally {
        window.setTimeout(() => setMessage(null), 5000);
      }
    };
    reader.readAsArrayBuffer(file);
  }

  return (
    <div className="backup-panel">
      <h3>Backup dos dados</h3>
      <p style={{ margin: 0 }}>
        Os contratos ficam salvos só neste navegador/dispositivo. Baixe um backup de vez em quando e guarde num
        lugar seguro (ex.: Google Drive) para não perder o histórico.
      </p>
      <div className="actions">
        <button type="button" className="btn-secondary" onClick={handleExport}>
          Baixar backup
        </button>
        <button type="button" className="btn-ghost" onClick={handleImportClick}>
          Restaurar backup
        </button>
      </div>

      {confirmingImport && (
        <p className="text-xs text-rose-600" style={{ marginTop: 8 }}>
          Atenção: restaurar um backup substitui todos os contratos salvos neste dispositivo.{" "}
          <button
            type="button"
            className="btn-danger"
            style={{ padding: "4px 8px", marginRight: 6 }}
            onClick={() => fileInputRef.current?.click()}
          >
            Escolher arquivo e continuar
          </button>
          <button type="button" className="btn-ghost" style={{ padding: "4px 8px" }} onClick={() => setConfirmingImport(false)}>
            Cancelar
          </button>
        </p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".sqlite,.db,application/x-sqlite3"
        style={{ display: "none" }}
        onChange={handleFileChosen}
      />

      {message && <p className="text-xs" style={{ marginTop: 8 }}>{message}</p>}
    </div>
  );
}
