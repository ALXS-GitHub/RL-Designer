export const ELEMENTS = {
  CAR: 'car',
  BALL: 'ball',
  WHEEL: 'wheel',
  BOOST_METER: 'boost_meter',
} as const;

export type ElementType = (typeof ELEMENTS)[keyof typeof ELEMENTS];