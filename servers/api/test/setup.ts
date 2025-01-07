import { afterAll, beforeAll, vi } from 'vitest';

beforeAll(() => {
  vi.useFakeTimers();
});

afterAll(() => {
  vi.useRealTimers();
});
