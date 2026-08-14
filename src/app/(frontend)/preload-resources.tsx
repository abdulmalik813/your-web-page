'use client'

import ReactDOM from 'react-dom'

export function PreloadResources() {
  ReactDOM.preload('/api/stylesheet', {
    as: 'style',
  })

  return null
}