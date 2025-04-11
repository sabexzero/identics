import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, parseISO } from "date-fns";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDateISO(dateString: string, dateFormat = "MMMM d, yyyy"): string {
    const date = parseISO(dateString);
    return format(date, dateFormat);
}
