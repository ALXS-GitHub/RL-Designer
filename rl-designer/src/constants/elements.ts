export const ELEMENTS = {
  CAR: 'car',
  BALL: 'ball',
//   WHEEL: 'wheel', // not supported yet
} as const;

export type ElementType = (typeof ELEMENTS)[keyof typeof ELEMENTS];