import type { VariantFrontInfo } from "@/types";

export function getAvailablePreview(
    variant: VariantFrontInfo,
    allowedFields?: Array<keyof VariantFrontInfo> // optional whitelist of fields to check, in priority order
): string | null {
    const defaultOrder: Array<keyof VariantFrontInfo> = [
        "preview_path",
        "one_diffuse_skin_path",
        "imageseq_subuv_path",
    ];

    const fieldsToCheck = allowedFields && allowedFields.length > 0 ? allowedFields : defaultOrder;

    for (const key of fieldsToCheck) {
        const val = variant[key];
        if (typeof val === "string" && val.length > 0) return val;
    }

    return null;
}