export const pet = {
  name: 'Luna',
  breed: 'Golden Retriever',
  age: 3,
  weight: 28.5,
  gender: 'Fêmea',
  color: 'Dourada',
  birthday: '12/03/2021',
  chip: '985112004567890',
  owner: 'Thomas Fontes',
  photo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop',
};

export interface Vaccine {
  id: string;
  name: string;
  date: string;
  nextDate: string;
  status: 'done' | 'pending' | 'overdue';
  veterinarian: string;
  clinic: string;
  notes: string;
}

export const vaccines: Vaccine[] = [
  {
    id: '1',
    name: 'V10 (Múltipla Décupla)',
    date: '10/03/2024',
    nextDate: '10/03/2025',
    status: 'done',
    veterinarian: 'Dr. Carlos Menezes',
    clinic: 'Clínica VetSaúde',
    notes: 'Reforço anual obrigatório',
  },
  {
    id: '2',
    name: 'Antirrábica',
    date: '15/03/2024',
    nextDate: '15/03/2025',
    status: 'done',
    veterinarian: 'Dr. Carlos Menezes',
    clinic: 'Clínica VetSaúde',
    notes: 'Exigida por lei',
  },
  {
    id: '3',
    name: 'Giárdia',
    date: '20/04/2024',
    nextDate: '20/04/2025',
    status: 'done',
    veterinarian: 'Dra. Ana Lima',
    clinic: 'PetClínic Center',
    notes: 'Recomendada para cães que frequentam parques',
  },
  {
    id: '4',
    name: 'Gripe Canina (Tosse dos Canis)',
    date: '05/01/2025',
    nextDate: '05/07/2025',
    status: 'pending',
    veterinarian: '',
    clinic: '',
    notes: 'Reforço semestral recomendado',
  },
  {
    id: '5',
    name: 'Leishmaniose',
    date: '',
    nextDate: '20/06/2025',
    status: 'pending',
    veterinarian: '',
    clinic: '',
    notes: 'Primeira dose ainda não aplicada',
  },
  {
    id: '6',
    name: 'Leptospirose',
    date: '10/01/2024',
    nextDate: '10/01/2025',
    status: 'overdue',
    veterinarian: 'Dra. Ana Lima',
    clinic: 'PetClínic Center',
    notes: 'Reforço anual — agendar com urgência',
  },
];

export interface HistoryEvent {
  id: string;
  type: 'consulta' | 'vacina' | 'exame' | 'cirurgia' | 'banho' | 'outros';
  title: string;
  date: string;
  description: string;
  veterinarian?: string;
  clinic?: string;
  cost?: string;
}

export const historyEvents: HistoryEvent[] = [
  {
    id: '1',
    type: 'consulta',
    title: 'Consulta de Rotina',
    date: '10/03/2024',
    description: 'Checkup anual completo. Luna está saudável, peso ideal e dentes em bom estado.',
    veterinarian: 'Dr. Carlos Menezes',
    clinic: 'Clínica VetSaúde',
    cost: 'R$ 180,00',
  },
  {
    id: '2',
    type: 'vacina',
    title: 'Vacinação V10 + Antirrábica',
    date: '15/03/2024',
    description: 'Aplicação da vacina múltipla décupla e antirrábica. Sem reações adversas.',
    veterinarian: 'Dr. Carlos Menezes',
    clinic: 'Clínica VetSaúde',
    cost: 'R$ 120,00',
  },
  {
    id: '3',
    type: 'exame',
    title: 'Exame de Sangue Completo',
    date: '10/04/2024',
    description: 'Hemograma completo e bioquímico. Todos os resultados dentro dos parâmetros normais.',
    veterinarian: 'Dra. Ana Lima',
    clinic: 'PetClínic Center',
    cost: 'R$ 220,00',
  },
  {
    id: '4',
    type: 'banho',
    title: 'Banho e Tosa',
    date: '25/04/2024',
    description: 'Banho completo, tosa higiênica, corte de unhas e limpeza de ouvidos.',
    clinic: 'PetShop Amigo Fiel',
    cost: 'R$ 90,00',
  },
  {
    id: '5',
    type: 'consulta',
    title: 'Consulta — Otite Leve',
    date: '08/05/2024',
    description: 'Luna apresentou coceira no ouvido. Diagnóstico: otite leve. Tratamento com gotas por 7 dias.',
    veterinarian: 'Dra. Patrícia Souza',
    clinic: 'Hospital Veterinário Central',
    cost: 'R$ 150,00',
  },
  {
    id: '6',
    type: 'exame',
    title: 'Ultrassom Abdominal',
    date: '20/06/2024',
    description: 'Exame preventivo. Órgãos abdominais sem alterações. Ótimo resultado.',
    veterinarian: 'Dr. Roberto Alves',
    clinic: 'Diagnóstico VetImagem',
    cost: 'R$ 350,00',
  },
  {
    id: '7',
    type: 'banho',
    title: 'Banho e Tosa',
    date: '15/07/2024',
    description: 'Banho completo, escovação e perfume. Luna ficou linda!',
    clinic: 'PetShop Amigo Fiel',
    cost: 'R$ 90,00',
  },
  {
    id: '8',
    type: 'consulta',
    title: 'Consulta — Acompanhamento',
    date: '10/09/2024',
    description: 'Retorno para avaliar estado geral. Tudo ótimo, Luna segue saudável e ativa.',
    veterinarian: 'Dr. Carlos Menezes',
    clinic: 'Clínica VetSaúde',
    cost: 'R$ 130,00',
  },
];

export interface Specialist {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: string;
  clinic: string;
  address: string;
  phone: string;
  available: boolean;
  photo: string;
}

export const specialists: Specialist[] = [
  {
    id: '1',
    name: 'Dr. Carlos Menezes',
    specialty: 'Clínica Geral',
    rating: 4.9,
    reviews: 312,
    experience: '15 anos',
    clinic: 'Clínica VetSaúde',
    address: 'Av. Paulista, 1500 — São Paulo, SP',
    phone: '(11) 3456-7890',
    available: true,
    photo: 'https://i.pravatar.cc/150?img=11',
  },
  {
    id: '2',
    name: 'Dra. Ana Lima',
    specialty: 'Dermatologia Veterinária',
    rating: 4.8,
    reviews: 187,
    experience: '10 anos',
    clinic: 'PetClínic Center',
    address: 'Rua Augusta, 800 — São Paulo, SP',
    phone: '(11) 2345-6789',
    available: true,
    photo: 'https://i.pravatar.cc/150?img=5',
  },
  {
    id: '3',
    name: 'Dra. Patrícia Souza',
    specialty: 'Ortopedia Veterinária',
    rating: 4.7,
    reviews: 245,
    experience: '12 anos',
    clinic: 'Hospital Veterinário Central',
    address: 'Rua Vergueiro, 2000 — São Paulo, SP',
    phone: '(11) 4567-8901',
    available: false,
    photo: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: '4',
    name: 'Dr. Roberto Alves',
    specialty: 'Diagnóstico por Imagem',
    rating: 4.9,
    reviews: 98,
    experience: '8 anos',
    clinic: 'Diagnóstico VetImagem',
    address: 'Av. Rebouças, 500 — São Paulo, SP',
    phone: '(11) 5678-9012',
    available: true,
    photo: 'https://i.pravatar.cc/150?img=3',
  },
  {
    id: '5',
    name: 'Dra. Fernanda Costa',
    specialty: 'Nutrição Animal',
    rating: 4.6,
    reviews: 134,
    experience: '7 anos',
    clinic: 'NutriPet Consultoria',
    address: 'Rua Oscar Freire, 300 — São Paulo, SP',
    phone: '(11) 6789-0123',
    available: true,
    photo: 'https://i.pravatar.cc/150?img=16',
  },
  {
    id: '6',
    name: 'Dr. Marcos Oliveira',
    specialty: 'Cardiologia Veterinária',
    rating: 4.8,
    reviews: 201,
    experience: '18 anos',
    clinic: 'CardioVet Especialidades',
    address: 'Av. Ibirapuera, 1200 — São Paulo, SP',
    phone: '(11) 7890-1234',
    available: false,
    photo: 'https://i.pravatar.cc/150?img=7',
  },
];

export interface CareCard {
  id: string;
  title: string;
  category: string;
  icon: string;
  color: string;
  tips: string[];
  frequency: string;
}

export const careCards: CareCard[] = [
  {
    id: '1',
    title: 'Alimentação',
    category: 'Nutrição',
    icon: 'nutrition',
    color: '#FF6B6B',
    frequency: 'Diário',
    tips: [
      'Ofereça ração de alta qualidade específica para Golden Retrievers adultos',
      'Divida a alimentação em 2 refeições por dia (manhã e noite)',
      'A porção diária recomendada para Luna é de 350-400g de ração',
      'Sempre deixe água fresca e limpa disponível',
      'Evite dar alimentos humanos como chocolate, uva, cebola e alho',
      'Petiscos não devem ultrapassar 10% da dieta diária',
    ],
  },
  {
    id: '2',
    title: 'Banho e Higiene',
    category: 'Grooming',
    icon: 'water',
    color: '#4ECDC4',
    frequency: 'Semanal',
    tips: [
      'Banho a cada 15-20 dias com shampoo neutro para cães',
      'Escove o pelo de Luna 3-4 vezes por semana para evitar nós',
      'Limpe as orelhas semanalmente com algodão umedecido',
      'Escove os dentes 2-3 vezes por semana com creme dental canino',
      'Corte as unhas a cada 3-4 semanas',
      'Após banho, seque bem entre os dedos para evitar fungo',
    ],
  },
  {
    id: '3',
    title: 'Exercícios',
    category: 'Atividade Física',
    icon: 'bicycle',
    color: '#45B7D1',
    frequency: 'Diário',
    tips: [
      'Golden Retrievers precisam de 60-90 minutos de exercício por dia',
      'Passeios matinais e vespertinos são ideais para Luna',
      'Brincadeiras de buscar a bolinha estimulam o instinto natural da raça',
      'Natação é excelente para Golden Retrievers — eles adoram água!',
      'Evite exercícios intensos nas horas mais quentes do dia',
      'Após os 7 anos, adapte a intensidade dos exercícios à idade',
    ],
  },
  {
    id: '4',
    title: 'Saúde Preventiva',
    category: 'Saúde',
    icon: 'shield-checkmark',
    color: '#96CEB4',
    frequency: 'Mensal',
    tips: [
      'Consultas de rotina a cada 6 meses com veterinário de confiança',
      'Aplique antipulgas e carrapatos mensalmente',
      'Vermifugação a cada 3-6 meses conforme orientação veterinária',
      'Mantenha todas as vacinas em dia — consulte o calendário',
      'Observe o comportamento diário e reporte mudanças ao vet',
      'Exames de sangue anuais para monitorar a saúde geral',
    ],
  },
  {
    id: '5',
    title: 'Bem-estar Mental',
    category: 'Comportamento',
    icon: 'happy',
    color: '#FFEAA7',
    frequency: 'Diário',
    tips: [
      'Golden Retrievers são sociais — evite deixar Luna sozinha por longos períodos',
      'Ofereça brinquedos interativos e de mastigação para estimulação mental',
      'Treinamento positivo fortalece o vínculo e a obediência',
      'Socialize com outros cães e pessoas desde filhote',
      'Rotinas consistentes trazem segurança e tranquilidade',
      'Dê atenção, carinho e afeto todos os dias!',
    ],
  },
  {
    id: '6',
    title: 'Sono e Descanso',
    category: 'Bem-estar',
    icon: 'moon',
    color: '#A29BFE',
    frequency: 'Diário',
    tips: [
      'Cães adultos dormem em média 12-14 horas por dia',
      'Providencie uma cama confortável e no lugar tranquilo',
      'Mantenha a cama de Luna longe de correntes de ar e umidade',
      'Respeite os momentos de descanso — não acorde o pet bruscamente',
      'Após exercícios intensos, deixe Luna descansar adequadamente',
      'Um ambiente calmo à noite ajuda na qualidade do sono',
    ],
  },
];

export const upcomingActivities = [
  {
    id: '1',
    title: 'Vacina Gripe Canina',
    date: '05/07/2025',
    type: 'vacina',
    icon: 'medical',
    color: '#2F6BFF',
  },
  {
    id: '2',
    title: 'Consulta de Rotina',
    date: '20/07/2025',
    type: 'consulta',
    icon: 'calendar',
    color: '#10B981',
  },
  {
    id: '3',
    title: 'Banho e Tosa',
    date: '28/06/2025',
    type: 'banho',
    icon: 'water',
    color: '#4ECDC4',
  },
  {
    id: '4',
    title: 'Vacina Leishmaniose',
    date: '20/06/2025',
    type: 'vacina',
    icon: 'medical',
    color: '#F59E0B',
  },
];
