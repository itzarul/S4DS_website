/** Pixel growth and shimmer from the supplied React Bits PixelCard source. */
export class Pixel {
  size = 0;
  sizeStep = Math.random() * 0.4;
  minSize = 0.5;
  maxSizeInteger = 2;
  maxSize = this.random(this.minSize, this.maxSizeInteger);
  counter = 0;
  isIdle = false;
  isReverse = false;
  isShimmer = false;
  speed: number;
  counterStep: number;

  constructor(
    canvas: HTMLCanvasElement,
    private ctx: CanvasRenderingContext2D,
    private x: number,
    private y: number,
    private color: string,
    speed: number,
    private delay: number,
  ) {
    this.speed = this.random(0.1, 0.9) * speed;
    this.counterStep = Math.random() * 4 + (canvas.width + canvas.height) * 0.01;
  }

  private random(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private draw() {
    const offset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(this.x + offset, this.y + offset, this.size, this.size);
  }

  appear() {
    this.isIdle = false;
    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }
    if (this.size >= this.maxSize) this.isShimmer = true;
    if (this.isShimmer) this.shimmer();
    else this.size += this.sizeStep;
    this.draw();
  }

  disappear() {
    this.isShimmer = false;
    this.counter = 0;
    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }
    this.size -= 0.1;
    this.draw();
  }

  private shimmer() {
    if (this.size >= this.maxSize) this.isReverse = true;
    else if (this.size <= this.minSize) this.isReverse = false;
    this.size += this.isReverse ? -this.speed : this.speed;
  }
}
