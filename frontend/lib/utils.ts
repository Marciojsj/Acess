import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, isValid, parseISO } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formata data com segurança, retornando fallback se data inválida
 */
export function formatDate(
  date: string | Date | null | undefined,
  formatStr: string = 'dd/MM/yyyy HH:mm',
  fallback: string = '-'
): string {
  if (!date) return fallback;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (!isValid(dateObj)) {
      return fallback;
    }

    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Erro ao formatar data:', error);
    return fallback;
  }
}

/**
 * Formata data apenas (sem hora)
 */
export function formatDateOnly(
  date: string | Date | null | undefined,
  fallback: string = '-'
): string {
  return formatDate(date, 'dd/MM/yyyy', fallback);
}

/**
 * Formata data e hora completos
 */
export function formatDateTime(
  date: string | Date | null | undefined,
  fallback: string = '-'
): string {
  return formatDate(date, 'dd/MM/yyyy HH:mm:ss', fallback);
}
