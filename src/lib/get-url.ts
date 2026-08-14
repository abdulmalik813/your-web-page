import { APP_URL } from '@/constants/init'
import canUseDOM from '@/lib/can-use-dom'

export const getServerSideURL = () => {
  return APP_URL
}

export const getClientSideURL = () => {
  if (canUseDOM) {
    const protocol = window.location.protocol
    const domain = window.location.hostname
    const port = window.location.port

    return `${protocol}//${domain}${port ? `:${port}` : ''}`
  }

  return APP_URL
}
