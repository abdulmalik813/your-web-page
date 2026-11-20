import { PreviewLinkGuard } from '@/components/PreviewLinkGuard';

/** Every draft preview route keeps its internal links under /preview. */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PreviewLinkGuard />
      {children}
    </>
  );
}
