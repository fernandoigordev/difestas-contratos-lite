import type { StepProps } from "./types";

export default function SectionFinalizacao({ data, onChange }: StepProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Autorização de imagem e fechamento</h2>

      <div>
        <label className="field-label">Uso de imagens da decoração</label>
        <div className="space-y-2">
          <label className="flex items-center gap-2 card cursor-pointer">
            <input
              type="radio"
              name="imageAuthorization"
              checked={data.imageAuthorization === true}
              onChange={() => onChange({ imageAuthorization: true })}
            />
            <span className="text-sm">Autoriza o uso de imagens para portfólio e redes sociais</span>
          </label>
          <label className="flex items-center gap-2 card cursor-pointer">
            <input
              type="radio"
              name="imageAuthorization"
              checked={data.imageAuthorization === false}
              onChange={() => onChange({ imageAuthorization: false })}
            />
            <span className="text-sm">Não autoriza o uso de imagens</span>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Cidade (assinatura)</label>
          <input
            className="field-input"
            value={data.signatureCity}
            onChange={(e) => onChange({ signatureCity: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label">Data do contrato</label>
          <input
            className="field-input"
            type="date"
            value={data.contractDate}
            onChange={(e) => onChange({ contractDate: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="field-label">Observações</label>
        <textarea
          className="field-input"
          rows={3}
          value={data.observations}
          onChange={(e) => onChange({ observations: e.target.value })}
        />
      </div>

      <label className="flex items-center gap-2 card cursor-pointer">
        <input
          type="checkbox"
          checked={data.generateAttachments}
          onChange={(e) => onChange({ generateAttachments: e.target.checked })}
        />
        <span className="text-sm">
          Incluir anexos no PDF (Anexo I – orçamento detalhado, Anexo II – comprovante de pagamento)
          <br />
          <span className="text-xs text-gray-500">Aumenta o número de páginas — deixe desmarcado para um contrato mais enxuto.</span>
        </span>
      </label>
    </div>
  );
}
