import { icons } from 'lucide-react'

function kebabToPascal(str: string): string {
  return str
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

export function IconRender({ 
  icon, 
  iconStyles 
}: { 
  icon: string
  iconStyles: string 
}) {
  const iconName = kebabToPascal(icon)
  const Icon = icons[iconName as keyof typeof icons]
  
  if (!Icon) {
    return null
  }
  
  return <Icon className={iconStyles} />
}