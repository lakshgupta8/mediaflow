export function generateGradientById(id: number): string {
    // Generate deterministic colors based on the ID
    const hue1 = (id * 137.5) % 360;
    const hue2 = (hue1 + 45) % 360; // 45 degrees apart for an analogous or bright gradient

    // We'll use HSL for vibrant, controllable colors
    const color1 = `hsl(${hue1}, 80%, 30%)`;
    const color2 = `hsl(${hue2}, 90%, 15%)`;

    return `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`;
}
