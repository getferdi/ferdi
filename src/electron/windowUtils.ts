import { screen } from 'electron';

export function isPositionValid(position: { x: number; y: number }) {
  const displays = screen.getAllDisplays();
  const { x, y } = position;
  return displays.some(
    ({ workArea }) =>
      x >= workArea.x &&
      x <= workArea.x + workArea.width &&
      y >= workArea.y &&
      y <= workArea.y + workArea.height,
  );
}
