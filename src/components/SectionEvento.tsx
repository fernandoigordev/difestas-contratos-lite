import type { StepProps } from "./types";
import { EVENT_TYPE_SUGGESTIONS } from "@/types/contract";
import ComboBox from "./ComboBox";

export default function SectionEvento({ data, onChange }: StepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Dados do evento</h2>

      <div>
        <label className="field-label">Tipo de evento *</label>
        <ComboBox
          value={data.eventType}
          onChange={(value) => onChange({ eventType: value })}
          options={EVENT_TYPE_SUGGESTIONS}
        />
      </div>

      <div>
        <label className="field-label">Tema</label>
        <input
          className="field-input"
          value={data.eventTheme}
          onChange={(e) => onChange({ eventTheme: e.target.value })}
        />
      </div>

      <div>
        <label className="field-label">Data do evento *</label>
        <input
          className="field-input"
          type="date"
          value={data.eventDate}
          onChange={(e) => onChange({ eventDate: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="field-label">Horário de início</label>
          <input
            className="field-input"
            type="time"
            value={data.eventStartTime}
            onChange={(e) => onChange({ eventStartTime: e.target.value })}
          />
        </div>
        <div>
          <label className="field-label">Horário de término</label>
          <input
            className="field-input"
            type="time"
            value={data.eventEndTime}
            onChange={(e) => onChange({ eventEndTime: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="field-label">Local *</label>
        <textarea
          className="field-input"
          rows={2}
          value={data.eventLocation}
          onChange={(e) => onChange({ eventLocation: e.target.value })}
        />
      </div>
    </div>
  );
}
