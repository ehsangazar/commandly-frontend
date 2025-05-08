import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function twMergeFunction(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
