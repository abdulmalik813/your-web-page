export type SearchParams =
  | Record<string, string | string[] | undefined | null>
  | Promise<Record<string, string | string[] | undefined | null>>
  | null