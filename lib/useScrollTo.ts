import bezier from "bezier-easing";
import {
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
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
  delay: number;
  duration: number;
  easing: bezier.EasingFunction;
};

const animate = (
  callback: (progress: number) => void,
  opts: AnimationOptions
) => {
  const start = Date.now();
  const { duration, delay, easing } = opts;

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
} & Partial<AnimationOptions>;

function lift<T, R>(value: T | ((arg: R) => T)) {
  type FunctionType = (arg: R) => T;

  return (x: R): T =>
    "function" === typeof value ? (value as FunctionType)(x) : value;
}

export function useScrollTo<T extends HTMLElement>(
  opts?: HookOptions
): [RefObject<T>, () => void] {
  const {
    auto = false,
    delay = 0,
    duration = 480,
    easing = bezier(0.25, 0.1, 0.25, 1),
    offsetLeft = 0,
    offsetTop = 0,
  } = opts ?? {};
  const elRef = useRef<T>(null);
  const durationRef = useRef(duration);
  const delayRef = useRef(delay);
  const offsetTopRef = useRef(offsetTop);
  const offsetLeftRef = useRef(offsetLeft);
  const easingRef = useRef(easing);

  useEffect(() => {
    durationRef.current = duration;
  }, [duration]);

  useEffect(() => {
    delayRef.current = delay;
  }, [delay]);

  useEffect(() => {
    offsetTopRef.current = offsetTop;
  }, [offsetTop]);

  useEffect(() => {
    offsetLeftRef.current = offsetLeft;
  }, [offsetLeft]);

  useEffect(() => {
    easingRef.current = easing;
  }, [easing]);

  const scroll = useCallback(() => {
    if (!elRef.current) {
      return;
    }

    const duration = durationRef.current;
    const delay = delayRef.current;
    const easing = easingRef.current;
    const offsetTop = offsetTopRef.current;
    const offsetLeft = offsetLeftRef.current;

    requestAnimationFrame(() => {
      const { top, left } = (elRef.current as T).getBoundingClientRect();
      const startTop = window?.scrollY ?? 0;
      const startLeft = window?.scrollX ?? 0;
      const targetTop = top - lift(offsetTop)(top > 0 ? 1 : -1);
      const targetLeft = left - lift(offsetLeft)(top > 0 ? 1 : -1);

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
  }, []);

  useLayoutEffect(() => {
    if (auto) {
      scroll();
    }
  }, [auto, scroll]);

  return [elRef, scroll];
}

// re-export "bezier-easing" lib
export { bezier };
