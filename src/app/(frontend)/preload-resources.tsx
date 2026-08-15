'use client'

import ReactDOM from 'react-dom'

export function PreloadResources({ href }: { href: string }) {
  ReactDOM.preload(href, {
    as: 'style',
  })

  return null
}