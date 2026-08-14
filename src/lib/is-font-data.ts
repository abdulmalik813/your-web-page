import { FontData } from "@/types/font-data";

export function isFontData(data: unknown): data is FontData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'id' in data &&
    'family' in data &&
    'category' in data &&
    'variable' in data &&
    'weight' in data &&
    'style' in data &&
    'subset' in data &&
    'fontCSS' in data 
  )
}