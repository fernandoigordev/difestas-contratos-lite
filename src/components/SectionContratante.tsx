import type { StepProps } from "./types";

export default function SectionContratante({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Dados do contratante</h2>

      <div>
        <label className="field-label">Nome completo *</label>
        <input
          className="field-input"
          value={data.clientName}
          onChange={(e) => onChange({ clientName: e.target.value })}
          autoComplete="name"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">CPF *</label>
          <input
            className="field-input"
            value={data.clientCpf}
            onChange={(e) => onChange({ clientCpf: e.target.value })}
            inputMode="numeric"
            placeholder="000.000.000-00"
          />
        </div>
        <div>
          <label className="field-label">RG</label>
          <input
            className="field-input"
            value={data.clientRg}
            onChange={(e) => onChange({ clientRg: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Nacionalidade</label>
          <input
            className="field-input"
            value={data.clientNationality}
            onChange={(e) => onChange({ clientNationality: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label">Estado civil</label>
          <input
            className="field-input"
            value={data.clientMaritalStatus}
            onChange={(e) => onChange({ clientMaritalStatus: e.target.value })}
            placeholder="Solteiro(a), casado(a)..."
          />
        </div>
      </div>

      <div>
        <label className="field-label">Endereço *</label>
        <input
          className="field-input"
          value={data.clientAddress}
          onChange={(e) => onChange({ clientAddress: e.target.value })}
          autoComplete="street-address"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Cidade/UF</label>
          <input
            className="field-input"
            value={data.clientCityUf}
            onChange={(e) => onChange({ clientCityUf: e.target.value })}
            placeholder="Fortaleza/CE"
          />
        </div>
        <div>
          <label className="field-label">CEP</label>
          <input
            className="field-input"
            value={data.clientCep}
            onChange={(e) => onChange({ clientCep: e.target.value })}
            inputMode="numeric"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Telefone/WhatsApp *</label>
          <input
            className="field-input"
            value={data.clientPhone}
            onChange={(e) => onChange({ clientPhone: e.target.value })}
            inputMode="tel"
            placeholder="(85) 90000-0000"
          />
        </div>
        <div>
          <label className="field-label">E-mail</label>
          <input
            className="field-input"
            type="email"
            value={data.clientEmail}
            onChange={(e) => onChange({ clientEmail: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
