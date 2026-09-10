export interface Vaccine {
  id: string;
  petId?: string;
  name: string;
  date: string;
  nextDate: string;
  status: 'done' | 'pending' | 'overdue';
  veterinarian: string;
  clinic: string;
  notes: string;
  createdAt?: number;
}

export type VaccinePayload = Omit<Vaccine, 'id'>;
