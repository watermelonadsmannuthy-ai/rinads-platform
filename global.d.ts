// Minimal JSX support so TypeScript understands JSX tags
// without relying on React's type definitions being installed.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}


