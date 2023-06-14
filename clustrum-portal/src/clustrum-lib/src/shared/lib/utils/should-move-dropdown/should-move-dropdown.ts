export function shouldMoveDropdown(node: HTMLElement | null, width: number): boolean {
  if (!node || !width) return false;

  const wrapperSize = node.getBoundingClientRect();
  const spaceBetween = window.innerWidth - wrapperSize.left;
  return spaceBetween < width;
}
