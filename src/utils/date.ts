export function calculateAge(birthDate: string): string {
  if (!birthDate) return 'Não informada';
  const birth = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(birth.getTime()) || birth > new Date()) return 'Data inválida';
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  let months = today.getMonth() - birth.getMonth();
  if (today.getDate() < birth.getDate()) months--;
  if (months < 0) { years--; months += 12; }
  if (years < 1) return `${Math.max(0, months)} ${months === 1 ? 'mês' : 'meses'}`;
  return `${years} ${years === 1 ? 'ano' : 'anos'}${months > 0 ? ` e ${months} ${months === 1 ? 'mês' : 'meses'}` : ''}`;
}
export function formatDate(date: string): string {
  if (!date) return '—';
  const d = new Date(`${date}T12:00:00`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString('pt-BR');
}
export function reminderDateTime(date: string, time: string): Date {
  return new Date(`${date}T${time || '09:00'}:00`);
}
