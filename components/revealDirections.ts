export type RevealDirection = 'left' | 'right' | 'up' | 'down' | 'scale';

const revealDirections: RevealDirection[] = ['left', 'up', 'right', 'down'];

export function revealDirectionForIndex(index: number): RevealDirection {
  return revealDirections[((index % revealDirections.length) + revealDirections.length) % revealDirections.length];
}
