export const isValidDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
export const isValidPhone = (value: string) => value.replace(/\D/g, '').length >= 8;
export const isNonEmpty = (value: string) => value.trim().length > 0;
