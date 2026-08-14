export interface SlugProps {
  params: Promise<{
    slug?: string[]
  }>
  searchParams: Promise<Record<string, string | string[] | undefined | null>>
}