export const PREVIEW_PATH = '/preview';

function asPath(pathname: string): string {
  const path = pathname.split(/[?#]/, 1)[0] || '/';
  return path.startsWith('/') ? path : `/${path}`;
}

/** True for /preview and /preview/<public path>, but not /previewish. */
export function isPreviewPath(pathname: string): boolean {
  const path = asPath(pathname);
  return path === PREVIEW_PATH || path.startsWith(`${PREVIEW_PATH}/`);
}

/** Map a preview path back to the public page it mirrors. */
export function toPublicPath(pathname: string): string {
  const path = asPath(pathname);

  if (path === PREVIEW_PATH) return '/';
  if (path.startsWith(`${PREVIEW_PATH}/`)) {
    return path.slice(PREVIEW_PATH.length).replace(/^\/{2,}/, '/') || '/';
  }

  return path.replace(/^\/{2,}/, '/');
}

/** Map a public path to its preview route without nesting /preview twice. */
export function toPreviewPath(pathname: string): string {
  const publicPath = toPublicPath(pathname);
  return publicPath === '/' ? PREVIEW_PATH : `${PREVIEW_PATH}${publicPath}`;
}
