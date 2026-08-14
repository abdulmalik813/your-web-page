import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')
  const draft = await draftMode()
  draft.disable()
  if (!path) {
    redirect('/')
  }

  if (path.startsWith('/')) {
    redirect(path)
  }

  redirect(`/${path}`)
}
