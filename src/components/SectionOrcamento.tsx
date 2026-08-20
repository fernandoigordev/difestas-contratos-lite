import type { StepProps } from "./types";
import { valorPorExtenso } from "@/lib/extenso";

export default function SectionOrcamento({ data, onChange }: StepProps) {
  function updateIncludedItem(index: number, patch: Partial<(typeof data.includedItems)[number]>) {
    const items = data.includedItems.map((item, i) => (i === index ? { ...item, ...patch } : item));
    onChange({ includedItems: items });
  }

  function addIncludedItem() {
    onChange({
      includedItems: [...data.includedItems, { description: "", quantity: null, value: null }],
    });
  }

  function removeIncludedItem(index: number) {
    onChange({ includedItems: data.includedItems.filter((_, i) => i !== index) });
  }

  function updateExcludedItem(index: number, description: string) {
    const items = data.excludedItems.map((item, i) => (i === index ? { description } : item));
    onChange({ excludedItems: items });
  }

  function addExcludedItem() {
    onChange({ excludedItems: [...data.excludedItems, { description: "" }] });
  }

  function removeExcludedItem(index: number) {
    onChange({ excludedItems: data.excludedItems.filter((_, i) => i !== index) });
  }

  function handleTotalValueChange(raw: string) {
    const value = raw === "" ? null : Number(raw);
    const patch: Partial<typeof data> = { totalValue: value };
    const autoPrevious = data.totalValue != null ? valorPorExtenso(data.totalValue) : "";
    if (!data.totalValueExtenso || data.totalValueExtenso === autoPrevious) {
      patch.totalValueExtenso = value != null && value >= 0 ? valorPorExtenso(value) : "";
    }
    onChange(patch);
  }

  return (
    <div className="space-y-5">
      <h2 className="text-lg font-semibold text-gray-900">Orçamento e itens</h2>

      <div>
        <label className="field-label">Itens incluídos</label>
        <div className="space-y-2">
          {data.includedItems.map((item, index) => (
            <div key={index} className="card space-y-2">
              <input
                className="field-input"
                placeholder="Descrição do item"
                value={item.description}
                onChange={(e) => updateIncludedItem(index, { description: e.target.value })}
              />
              <div className="flex gap-2">
                <input
                  className="field-input"
                  type="number"
                  min={0}
                  placeholder="Qtd."
                  value={item.quantity ?? ""}
                  onChange={(e) =>
                    updateIncludedItem(index, {
                      quantity: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
                <input
                  className="field-input"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="Valor (R$)"
                  value={item.value ?? ""}
                  onChange={(e) =>
                    updateIncludedItem(index, {
                      value: e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => removeIncludedItem(index)}
                  className="shrink-0 text-rose-600 text-sm px-2"
                  aria-label="Remover item"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={addIncludedItem} className="btn-secondary mt-2 w-full">
          + Adicionar item incluído
        </button>
      </div>

      <div>
        <label className="field-label">Itens não incluídos</label>
        <div className="space-y-2">
          {data.excludedItems.map((item, index) => (
            <div key={index} className="flex gap-2">
              <input
                className="field-input"
                placeholder="Ex.: Buffet, fotografia..."
                value={item.description}
                onChange={(e) => updateExcludedItem(index, e.target.value)}
              />
              <button
                type="button"
                onClick={() => removeExcludedItem(index)}
                className="shrink-0 text-rose-600 text-sm px-2"
                aria-label="Remover item"
              >
                Remover
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addExcludedItem} className="btn-secondary mt-2 w-full">
          + Adicionar item não incluído
        </button>
      </div>

      <div>
        <label className="field-label">Valor total *</label>
        <input
          className="field-input"
          type="number"
          min={0}
          step="0.01"
          value={data.totalValue ?? ""}
          onChange={(e) => handleTotalValueChange(e.target.value)}
        />
      </div>

      <div>
        <label className="field-label">Valor por extenso</label>
        <textarea
          className="field-input"
          rows={2}
          value={data.totalValueExtenso}
          onChange={(e) => onChange({ totalValueExtenso: e.target.value })}
        />
        <p className="text-xs text-gray-500 mt-1">
          Sugestão automática — revise antes de gerar o contrato.
        </p>
      </div>
    </div>
  );
}
