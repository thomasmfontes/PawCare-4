import Constants from 'expo-constants';

export const APP_INFO = {
  name: 'PawCare',
  version: Constants.expoConfig?.version || '1.0.0',
  // O hash do commit de referência da versão publicada
  commitHash: (Constants.expoConfig?.extra as any)?.commitHash || '10f8f44',
  sprint: 'Sprint 4 - Entrega Final',
  institution: 'FIAP',
  course: 'Mobile Application Development',
  team: [
    { name: 'Thomas Fontes', rm: 'RM 562254' },
    { name: 'Gabriel Maciel', rm: 'RM 562795' },
    { name: 'Vitória Rodrigues', rm: 'RM 565160' },
    { name: 'Augusto Bonomo', rm: 'RM 565155' },
    { name: 'Matheus Molina', rm: 'RM 563399' },
  ],
};

export default APP_INFO;
