import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { profile } from '@/data/content';

// Feeds the in-page CV viewer. Some browsers, download managers and policies grab any request for an
// application/pdf URL and turn it into a download, so the viewer fetches the same bytes from this
// extension-less URL as a generic binary and draws them itself (see components/CvViewer.tsx).
export const dynamic = 'force-static';

export async function GET() {
  const file = await readFile(path.join(process.cwd(), 'public', profile.cv));
  return new Response(new Uint8Array(file), {
    headers: { 'Content-Type': 'application/octet-stream', 'Cache-Control': 'public, max-age=300' },
  });
}
