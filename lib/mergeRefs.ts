import type { MutableRefObject, Ref, RefCallback } from "react";

/**
 * Combines several refs into one callback ref.
 * Lets a single element serve both a scene timeline and the chapter observer
 * without wrapping it in an extra DOM node.
 */
export function mergeRefs<T>(
  ...refs: Array<Ref<T> | undefined | null>
): RefCallback<T> {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(value);
      else (ref as MutableRefObject<T | null>).current = value;
    }
  };
}
