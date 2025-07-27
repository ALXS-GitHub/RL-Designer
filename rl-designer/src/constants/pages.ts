export const PAGES = {
    COLLECTION: 'collection',
    EXPLORER: 'explorer',
} as const;

export type PageType = (typeof PAGES)[keyof typeof PAGES];