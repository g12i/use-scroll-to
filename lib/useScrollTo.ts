import bezier from "bezier-easing";
import type { EasingFunction } from "bezier-easing";
import {
  RefObject,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";

enum NextState {
  Stop,
  Continue,
}

const animationLoop = (next: () => NextState) => {
  let i: number;

  const loop = () => {
    if (next() === NextState.Stop) {
      cancelAnimationFrame(i);
    } else {
      i = requestAnimationFrame(loop);
    }
  };

  i = requestAnimationFrame(loop);
};

export type AnimationOptions = {
  delay?: number;
  duration: number;
  easing?: EasingFunction;
};

const animate = (
  callback: (progress: number) => void,
  opts: AnimationOptions
) => {
  const start = Date.now();
  const { duration, delay = 0, easing = bezier(0.25, 0.1, 0.25, 1) } = opts;

  animationLoop(() => {
    const now = Date.now();
    const passed = now - (start + delay);
    const progress = Math.max(0, Math.min(1, passed / duration));

    callback(easing(progress));

    if (passed >= duration) {
      return NextState.Stop;
    }

    return NextState.Continue;
  });
};

type HookOptions = {
  auto?: boolean;
  offsetLeft?: number | ((direction: number) => number);
  offsetTop?: number | ((direction: number) => number);
};

function lift<T, R>(value: T | ((arg: R) => T)) {
  type FunctionType = (arg: R) => T;

  return (x: R): T =>
    "function" === typeof value ? (value as FunctionType)(x) : value;
}

export function useScrollTo<T extends HTMLElement>(
  opts: HookOptions & AnimationOptions
): [RefObject<T>, () => void] {
  const {
    auto = false,
    delay,
    duration,
    easing,
    offsetLeft = 0,
    offsetTop = 0,
  } = opts;
  const ref = useRef<T>(null);
  const getOffsetTop = useMemo(() => lift(offsetTop), [offsetTop]);
  const getOffsetLeft = useMemo(() => lift(offsetLeft), [offsetLeft]);

  const scroll = useCallback(() => {
    if (!ref.current) {
      return;
    }

    requestAnimationFrame(() => {
      const { top, left } = (ref.current as T).getBoundingClientRect();
      const startTop = window?.scrollY ?? 0;
      const startLeft = window?.scrollX ?? 0;
      const targetTop = top - getOffsetTop(top > 0 ? 1 : -1);
      const targetLeft = left - getOffsetLeft(top > 0 ? 1 : -1);

      if ("number" !== typeof duration || duration <= 0) {
        window?.scrollTo({
          top: startTop + targetTop,
          left: startLeft + targetLeft,
          behavior: "auto",
        });
      } else {
        animate(
          (progress: number) => {
            window?.scrollTo({
              top: startTop + progress * targetTop,
              left: startLeft + progress * targetLeft,
              behavior: "auto",
            });
          },
          { duration, delay, easing }
        );
      }
    });
  }, [duration, delay, easing, getOffsetLeft, getOffsetTop]);

  useLayoutEffect(() => {
    if (auto) {
      scroll();
    }
  }, [auto, scroll]);

  return [ref, scroll];
}

// re-export "bezier-easing" lib
export type { EasingFunction };
export { bezier };
