// Imperative motion engine for the hero: cursor tilt, glare, garnish parallax
// and repulsion, rising fizz, and the spin-and-burst drink switch.

export interface HeroMotionElements {
  hero: HTMLElement;
  media: HTMLElement;
  stage: HTMLElement;
  fizz: HTMLElement;
  front: HTMLElement;
  back: HTMLElement;
}

export interface HeroMotion {
  /** Runs the switch animation and calls `swap` at its midpoint. Returns false while busy. */
  switchDrink: (swap: () => void) => boolean;
  destroy: () => void;
}

interface SwitchPose {
  x: number;
  y: number;
  rot: number;
  scale: number;
  opacity: number;
}

interface GarnishState {
  el: HTMLElement;
  front: boolean;
  homeX: number;
  homeY: number;
  rx: number;
  ry: number;
  angle: number;
  baseX: number;
  baseY: number;
  pose: SwitchPose | null;
}

type Ease = (t: number) => number;

const easeInCubic: Ease = t => t * t * t;
const backOut = (s: number): Ease => t => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Tuned for a subtle feel
const TILT_Y = 9;
const TILT_X = 6;
const POINTER_LERP = 0.05;
const PARALLAX_FRONT = 36;
const PARALLAX_BACK = -18;
const REPEL_RADIUS = 300;
const REPEL_STRENGTH = -60;
const SPIN_SPEED = 0.08;
const FLOAT_Y = 10;
const FLOAT_ANGLE = 5;
const FLOAT_DURATIONS = [5, 7, 6, 8, 5.5, 6.5, 9, 11, 10];
const MAX_BUBBLES = 28;

export function createHeroMotion(els: HeroMotionElements): HeroMotion {
  const { hero, media, stage, fizz, front, back } = els;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      switchDrink: swap => {
        swap();
        return true;
      },
      destroy: () => {},
    };
  }

  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const garnishes: GarnishState[] = [
    ...Array.from(front.querySelectorAll<HTMLElement>('.garnish')).map(el => ({ el, front: true })),
    ...Array.from(back.querySelectorAll<HTMLElement>('.garnish')).map(el => ({ el, front: false })),
  ].map(({ el, front: isFront }) => ({
    el,
    front: isFront,
    homeX: 0,
    homeY: 0,
    rx: 0,
    ry: 0,
    angle: Math.random() * 360,
    baseX: 0,
    baseY: 0,
    pose: null,
  }));

  const pointer = { x: -9999, y: -9999, active: false };
  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let glare = 0;
  let spin = 0;
  let blur = 0;
  let switching = false;
  let frameId = 0;
  let bubbleTimer = 0;
  const cancels = new Set<() => void>();

  // Positions ignore transforms, so they can be cached and reused every frame
  const measure = () => {
    garnishes.forEach(g => {
      const offsetX = g.front ? media.offsetLeft : 0;
      const offsetY = g.front ? media.offsetTop : 0;
      g.homeX = offsetX + g.el.offsetLeft + g.el.offsetWidth / 2;
      g.homeY = offsetY + g.el.offsetTop + g.el.offsetHeight / 2;
    });
    fizz.style.setProperty('--fizz-h', `${fizz.offsetHeight}px`);
  };

  const tween = (opts: {
    duration: number;
    delay?: number;
    ease: Ease;
    update: (p: number) => void;
    done?: () => void;
  }) => {
    let start = -1;
    let id = 0;
    const cancel = () => cancelAnimationFrame(id);
    const step = (now: number) => {
      if (start < 0) start = now + (opts.delay ?? 0);
      if (now < start) {
        id = requestAnimationFrame(step);
        return;
      }
      const t = Math.min(1, (now - start) / opts.duration);
      opts.update(opts.ease(t));
      if (t < 1) {
        id = requestAnimationFrame(step);
      } else {
        cancels.delete(cancel);
        opts.done?.();
      }
    };
    id = requestAnimationFrame(step);
    cancels.add(cancel);
  };

  const frame = (now: number) => {
    frameId = requestAnimationFrame(frame);
    const time = now / 1000;
    const rect = hero.getBoundingClientRect();
    const px = pointer.x - rect.left;
    const py = pointer.y - rect.top;
    const inside = pointer.active && px >= 0 && py >= 0 && px <= rect.width && py <= rect.height;

    target.x = inside ? px / rect.width - 0.5 : 0;
    target.y = inside ? py / rect.height - 0.5 : 0;
    current.x += (target.x - current.x) * POINTER_LERP;
    current.y += (target.y - current.y) * POINTER_LERP;
    glare += ((inside ? 1 : 0) - glare) * 0.06;

    stage.style.transform = `rotateY(${current.x * TILT_Y + spin}deg) rotateX(${-current.y * TILT_X}deg)`;
    stage.style.setProperty('--spin-blur', `${blur.toFixed(2)}px`);
    stage.style.setProperty('--gx', `${((current.x + 0.5) * 100).toFixed(1)}%`);
    stage.style.setProperty('--gy', `${((current.y + 0.5) * 100).toFixed(1)}%`);
    stage.style.setProperty('--glare', glare.toFixed(3));

    const frontX = current.x * PARALLAX_FRONT;
    const frontY = current.y * PARALLAX_FRONT;
    const backX = current.x * PARALLAX_BACK;
    const backY = current.y * PARALLAX_BACK;
    front.style.transform = `translate3d(${frontX}px, ${frontY}px, 0)`;
    back.style.transform = `translate3d(${backX}px, ${backY}px, 0)`;

    garnishes.forEach((g, i) => {
      if (g.pose) {
        const p = g.pose;
        g.el.style.transform = `translate(${p.x}px, ${p.y}px) rotate(${p.rot}deg) scale(${p.scale})`;
        g.el.style.opacity = String(p.opacity);
        return;
      }

      let targetRx = 0;
      let targetRy = 0;
      let speed = 1;

      if (inside) {
        const cx = g.homeX + (g.front ? frontX : backX) + g.baseX + g.rx;
        const cy = g.homeY + (g.front ? frontY : backY) + g.baseY + g.ry;
        const dx = px - cx;
        const dy = py - cy;
        const distance = Math.hypot(dx, dy);
        if (distance < REPEL_RADIUS && distance > 0.5) {
          const force = (REPEL_RADIUS - distance) / REPEL_RADIUS;
          targetRx = (dx / distance) * force * REPEL_STRENGTH;
          targetRy = (dy / distance) * force * REPEL_STRENGTH;
          speed = 1 + force * 4;
        }
      }

      g.rx += (targetRx - g.rx) * 0.1;
      g.ry += (targetRy - g.ry) * 0.1;
      g.angle += SPIN_SPEED * speed;

      const duration = FLOAT_DURATIONS[i % FLOAT_DURATIONS.length];
      const phase = (time + i * 0.7) * ((Math.PI * 2) / duration);
      const floatY = Math.sin(phase) * FLOAT_Y;
      const floatAngle = Math.cos(phase) * FLOAT_ANGLE;

      g.el.style.transform = `translate(${g.rx + g.baseX}px, ${g.ry + g.baseY + floatY}px) rotate(${g.angle + floatAngle}deg)`;
    });
  };

  const spawnBubble = () => {
    if (document.hidden || fizz.childElementCount >= MAX_BUBBLES) return;
    const bubble = document.createElement('span');
    const size = 4 + Math.random() * 10;
    const duration = 5 + Math.random() * 5;
    bubble.className = 'fizz-bubble';
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${15 + Math.random() * 85}%`;
    bubble.style.setProperty('--drift', `${(Math.random() - 0.5) * 40}px`);
    bubble.style.setProperty('--o', (0.35 + Math.random() * 0.4).toFixed(2));
    bubble.style.animation = `fizz-rise ${duration}s linear forwards`;
    bubble.addEventListener('animationend', () => bubble.remove());
    fizz.appendChild(bubble);
  };

  const start = () => {
    if (frameId) return;
    frameId = requestAnimationFrame(frame);
    bubbleTimer = window.setInterval(spawnBubble, finePointer ? 420 : 800);
  };

  const stop = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    window.clearInterval(bubbleTimer);
  };

  const onPointerMove = (e: PointerEvent) => {
    if (!finePointer || e.pointerType !== 'mouse') return;
    pointer.x = e.clientX;
    pointer.y = e.clientY;
    pointer.active = true;
  };

  const onPointerLeave = () => {
    pointer.active = false;
  };

  const resizeObserver = new ResizeObserver(measure);
  resizeObserver.observe(hero);

  // Only animate while the hero is on screen
  const intersection = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) start();
    else stop();
  });
  intersection.observe(hero);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onPointerLeave);

  measure();
  start();

  const switchDrink = (swap: () => void) => {
    if (switching) return false;
    switching = true;

    // Photo: spin edge-on with motion blur, swap, then spin back in
    tween({
      duration: 450,
      ease: easeInCubic,
      update: p => {
        spin = 90 * p;
        blur = 6 * p;
      },
      done: () => {
        swap();
        tween({
          duration: 1100,
          ease: backOut(0.9),
          update: p => {
            spin = -90 + 90 * p;
            blur = Math.max(0, 6 * (1 - p));
          },
          done: () => {
            spin = 0;
            blur = 0;
          },
        });
      },
    });

    // Garnishes: pull into the glass, then burst back out to new spots
    const centerX = media.offsetLeft + media.offsetWidth * 0.58;
    const centerY = media.offsetTop + media.offsetHeight * 0.5;
    let pending = garnishes.length;
    if (!pending) setTimeout(() => (switching = false), 1550);

    garnishes.forEach((g, i) => {
      const fromX = g.baseX + g.rx;
      const fromY = g.baseY + g.ry;
      const fromRot = g.angle;
      const inX = centerX - g.homeX;
      const inY = centerY - g.homeY;
      const range = g.front ? 140 : 60;
      const nextX = (Math.random() - 0.5) * range;
      const nextY = (Math.random() - 0.5) * range;
      const pose: SwitchPose = { x: fromX, y: fromY, rot: fromRot, scale: 1, opacity: 1 };
      g.pose = pose;

      tween({
        delay: i * 25,
        duration: 450,
        ease: easeInCubic,
        update: p => {
          pose.x = lerp(fromX, inX, p);
          pose.y = lerp(fromY, inY, p);
          pose.rot = fromRot + 45 * p;
          pose.scale = 1 - 0.9 * p;
          pose.opacity = 1 - p;
        },
        done: () => {
          tween({
            delay: 250,
            duration: 850,
            ease: backOut(1.4),
            update: p => {
              pose.x = lerp(inX, nextX, p);
              pose.y = lerp(inY, nextY, p);
              pose.rot = fromRot + 45 + 45 * p;
              pose.scale = 0.1 + 0.9 * p;
              pose.opacity = Math.min(1, p * 1.5);
            },
            done: () => {
              g.baseX = nextX;
              g.baseY = nextY;
              g.angle = fromRot + 90;
              g.rx = 0;
              g.ry = 0;
              g.pose = null;
              g.el.style.opacity = '';
              pending -= 1;
              if (pending === 0) switching = false;
            },
          });
        },
      });
    });

    return true;
  };

  const destroy = () => {
    stop();
    cancels.forEach(cancel => cancel());
    cancels.clear();
    resizeObserver.disconnect();
    intersection.disconnect();
    window.removeEventListener('pointermove', onPointerMove);
    document.documentElement.removeEventListener('pointerleave', onPointerLeave);
    fizz.replaceChildren();
  };

  return { switchDrink, destroy };
}
