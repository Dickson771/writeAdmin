import { addHours, differenceInHours, isAfter, isBefore } from 'date-fns';

export function currency(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value || 0);
}

export function deadlineState(deadline: string | Date) {
  const target = new Date(deadline);
  const now = new Date();
  if (isBefore(target, now)) return 'overdue';
  const hours = differenceInHours(target, now);
  if (hours <= 48) return 'soon';
  return 'ok';
}

export function computeReminderDates(deadline: Date, include24 = true, include6 = true) {
  const reminders: Date[] = [];
  if (include24 && isAfter(deadline, addHours(new Date(), 24))) reminders.push(addHours(deadline, -24));
  if (include6 && isAfter(deadline, addHours(new Date(), 6))) reminders.push(addHours(deadline, -6));
  return reminders;
}
