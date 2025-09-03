import { jest } from '@jest/globals';

let currentDbImpl: any;

export const __setDbImpl = (impl: any) => {
  currentDbImpl = impl;
};

export const db = jest.fn(() => currentDbImpl);
