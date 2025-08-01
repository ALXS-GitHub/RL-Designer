export const COLORS = {
    MAIN_TEAM_COLOR: 'mainTeamColor',
    SECONDARY_COLOR: 'secondaryColor', // TODO : not implemented yet
    CAR_COLOR: 'carColor', 
    DECAL_COLOR: 'decalColor', // For decal that have painted variants // TODO : not implemented yet
} as const;

export type ColorType = (typeof COLORS)[keyof typeof COLORS];

export const DEFAULT_COLORS: Record<ColorType, string> = {
    mainTeamColor: '#FFFFFF',
    secondaryColor: '#000000',
    decalColor: '#000000',
    carColor: '#555555',
};