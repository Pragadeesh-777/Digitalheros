declare namespace JSX {
  interface IntrinsicElements {
    [elem: string]: any;
  }
  interface Element {
    [key: string]: any;
  }
}

declare namespace React {
  type ReactNode = any;
  type ComponentType<P = {}> = any;
  type SVGProps<T> = any;
  type ChangeEvent<T = any> = any;
  type FormEvent<T = any> = any;
  type KeyboardEvent<T = any> = any;
  type MouseEvent<T = any> = any;
  type RefObject<T> = { current: T | null };
}

declare module 'react' {
  export type ReactNode = any;
  export type ComponentType<P = {}> = any;
  export type SVGProps<T> = any;
  export type ChangeEvent<T = any> = any;

  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useRef<T>(initialValue: T | null): { current: T };
  
  const React: any;
  export default React;
}
