export const SUPPORTED_MODELS = {
    OCTANE: 'Octane',
    DOMINUS: 'Dominus',
    FENNEC: 'Fennec',
    ROADHOG: 'Roadhog',
    VENOM: 'Venom',
    ESPER: 'Esper',
} as const;

export type ModelType = (typeof SUPPORTED_MODELS)[keyof typeof SUPPORTED_MODELS];