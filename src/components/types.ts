import type { ContractFormData } from "@/types/contract";

export interface StepProps {
  data: ContractFormData;
  onChange: (patch: Partial<ContractFormData>) => void;
}
