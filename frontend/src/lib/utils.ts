import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null | undefined): string {
    if (date === null || date === undefined) {
        return "";
    }

    const dateTemp = typeof date === "string" ? new Date(date) : date;

    if (isNaN(dateTemp.getTime())) {
        return "";
    }

    const day = dateTemp.getDate();
    const monthIndex = dateTemp.getMonth();
    const year = dateTemp.getFullYear();

    const months = [
        "Января",
        "Февраля",
        "Марта",
        "Апреля",
        "Мая",
        "Июня",
        "Июля",
        "Августа",
        "Сентября",
        "Октября",
        "Ноября",
        "Декабря",
    ];

    return `${day} ${months[monthIndex]} ${year}`;
}
