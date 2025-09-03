declare module '@itbaf/tournaments-models' {
  // In tests we mock this module. Keep types permissive here.
  export function db(): any;
  export const __setDbImpl: (impl: any) => void;
}
