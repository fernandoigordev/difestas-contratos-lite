import { useEffect, useRef, useState } from "react";

interface ComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
}

/**
 * Campo de texto livre com sugestões em lista ancorada, no estilo de um
 * combobox. Existe porque `<input list>` + `<datalist>` (a alternativa
 * nativa do navegador) é renderizado de forma inconsistente — no Safari do
 * iOS, por exemplo, as sugestões aparecem soltas na parte de baixo da tela
 * em vez de logo abaixo do campo.
 */
export default function ComboBox({ value, onChange, options, placeholder }: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutside(e: Event) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [open]);

  const term = value.trim().toLowerCase();
  const filtered = term ? options.filter((o) => o.toLowerCase().includes(term)) : options;

  return (
    <div className="combobox" ref={containerRef}>
      <input
        className="field-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        autoComplete="off"
      />
      {open && filtered.length > 0 && (
        <div className="combobox-menu">
          {filtered.map((option) => (
            <div
              key={option}
              className="combobox-option"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(option);
                setOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
