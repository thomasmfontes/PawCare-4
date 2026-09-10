export interface Pet {
  id: string;
  name: string;
  breed: string;
  age: number;
  weight: number;
  gender: 'Macho' | 'Fêmea';
  color: string;
  birthday?: string;
  chip?: string;
  owner?: string;
  photo?: string;
  createdAt?: number;
}

export type PetPayload = Omit<Pet, 'id'>;
