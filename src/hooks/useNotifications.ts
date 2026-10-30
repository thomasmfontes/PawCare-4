import { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

export function useNotifications() {
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    notificationService.requestPermissions().then(setHasPermission);
  }, []);

  const notifyVaccineScheduled = async (vaccineName: string, petName: string, nextDate: string) => {
    // Dispara confirmação imediata
    await notificationService.sendImmediateNotification(
      '💉 Lembrete de Vacina Agendado!',
      `A dose de ${vaccineName} para ${petName} foi registrada para ${nextDate}. Você será avisado!`,
      { screen: 'Vaccines', petName, vaccineName }
    );

    // Agenda um lembrete automático
    await notificationService.scheduleReminderNotification(
      '⏰ Atenção: Vacina Prevista!',
      `Lembre-se: ${petName} tem aplicação de ${vaccineName} agendada para ${nextDate}.`,
      10, // 10 segundos para demonstrar no vídeo de apresentação de forma realista e funcional
      { screen: 'Vaccines', petName, vaccineName }
    );
  };

  const notifyAppointmentBooked = async (specialistName: string, specialty: string, clinic: string) => {
    await notificationService.sendImmediateNotification(
      '📅 Consulta Agendada com Sucesso!',
      `Consulta de rotina marcada com ${specialistName} (${specialty}) na ${clinic}.`,
      { screen: 'History' }
    );
  };

  const notifyCareCompleted = async (careTitle: string) => {
    await notificationService.sendImmediateNotification(
      '✅ Cuidado Realizado!',
      `A rotina de "${careTitle}" foi concluída e salva no histórico do seu pet.`,
      { screen: 'Care' }
    );
  };

  return {
    hasPermission,
    requestPermissions: notificationService.requestPermissions,
    notifyVaccineScheduled,
    notifyAppointmentBooked,
    notifyCareCompleted,
    sendNotification: notificationService.sendImmediateNotification,
  };
}

export default useNotifications;
