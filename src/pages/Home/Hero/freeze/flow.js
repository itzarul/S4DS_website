/** @param {import("../../../../lib/effectScope").EffectScope} scope */
export default function mount(scope) {
  const { window } = scope.environment;
  // A bounded fluid wake. Velocity carries the stroke; density keeps its thin
  // curling edges alive briefly after the pointer has moved on.
  window.createFreezeFlow = () => {
    const n = window.RenderQuality?.low ? 64 : 96,
      count = n * n;
    let field = new Float32Array(count * 3),
      next = new Float32Array(count * 3);
    const curl = new Float32Array(count),
      bytes = new Uint8Array(count * 4);
    const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    function clear() {
      field.fill(0);
      next.fill(0);
      curl.fill(0);
      for (let i = 0; i < count; i++) {
        bytes[i * 4] = bytes[i * 4 + 1] = 128;
        bytes[i * 4 + 2] = 0;
        bytes[i * 4 + 3] = 255;
      }
    }
    function stroke(x, y, dx, dy, aspect) {
      const distance = Math.hypot(dx * aspect, dy);
      if (distance < 0.00001) return;
      const radius = 0.067,
        amount = Math.min(0.6, distance * 38);
      for (
        let iy = Math.max(1, Math.floor((y - radius) * n));
        iy < Math.min(n - 1, Math.ceil((y + radius) * n));
        iy++
      )
        for (
          let ix = Math.max(1, Math.floor((x - radius / aspect) * n));
          ix < Math.min(n - 1, Math.ceil((x + radius / aspect) * n));
          ix++
        ) {
          const px = ((ix / n - x) * aspect) / radius,
            py = (iy / n - y) / radius,
            r2 = px * px + py * py;
          if (r2 >= 1) continue;
          const f = (1 - r2) ** 3,
            i = (iy * n + ix) * 3;
          // Paired eddies curl the two edges of the moving stroke.
          const side = (px * dy - py * dx * aspect) / distance;
          field[i] = clamp(
            field[i] + dx * 2.4 * f - (py * side * amount * 0.015) / aspect,
            -0.16,
            0.16,
          );
          field[i + 1] = clamp(
            field[i + 1] + dy * 2.4 * f + px * side * amount * 0.015,
            -0.16,
            0.16,
          );
          field[i + 2] = Math.min(1, field[i + 2] + amount * f);
        }
    }
    function step(dt) {
      const decay = Math.exp(-dt * 2.2),
        fade = Math.exp(-dt * 1.65);
      for (let y = 1; y < n - 1; y++)
        for (let x = 1; x < n - 1; x++) {
          const k = y * n + x,
            i = k * 3;
          curl[k] = (field[i + 4] - field[i - 2] - field[i + n * 3] + field[i - n * 3]) * 0.5;
        }
      for (let y = 1; y < n - 1; y++)
        for (let x = 1; x < n - 1; x++) {
          const k = y * n + x,
            i = k * 3;
          const gx = Math.abs(curl[k + 1]) - Math.abs(curl[k - 1]),
            gy = Math.abs(curl[k + n]) - Math.abs(curl[k - n]);
          const norm = Math.hypot(gx, gy) + 0.00001;
          const vx = field[i] + (gy / norm) * curl[k] * dt * 5;
          const vy = field[i + 1] - (gx / norm) * curl[k] * dt * 5 + field[i + 2] * dt * 0.012;
          const sx = clamp(x - vx * n * dt * 2, 0, n - 1.001),
            sy = clamp(y - vy * n * dt * 2, 0, n - 1.001);
          const x0 = Math.floor(sx),
            y0 = Math.floor(sy),
            fx = sx - x0,
            fy = sy - y0,
            j = (y0 * n + x0) * 3;
          for (let c = 0; c < 3; c++) {
            const sample =
              (field[j + c] * (1 - fx) + field[j + 3 + c] * fx) * (1 - fy) +
              (field[j + n * 3 + c] * (1 - fx) + field[j + n * 3 + 3 + c] * fx) * fy;
            const neighbors =
              (field[i - 3 + c] + field[i + 3 + c] + field[i - n * 3 + c] + field[i + n * 3 + c]) *
              0.25;
            next[i + c] = (sample * 0.985 + neighbors * 0.015) * (c === 2 ? fade : decay);
          }
          next[i] += (vx - field[i]) * decay;
          next[i + 1] += (vy - field[i + 1]) * decay;
        }
      [field, next] = [next, field];
      let strength = 0;
      for (let i = 0; i < count; i++) {
        field[i * 3] = clamp(field[i * 3], -0.16, 0.16);
        field[i * 3 + 1] = clamp(field[i * 3 + 1], -0.16, 0.16);
        bytes[i * 4] = Math.round(128 + field[i * 3] * 450);
        bytes[i * 4 + 1] = Math.round(128 + field[i * 3 + 1] * 450);
        bytes[i * 4 + 2] = Math.round(clamp(field[i * 3 + 2], 0, 1) * 255);
        strength += Math.abs(field[i * 3]) + Math.abs(field[i * 3 + 1]);
      }
      return strength;
    }
    clear();
    return { size: n, bytes, clear, stroke, step };
  };
}
