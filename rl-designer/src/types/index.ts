export interface VariantFrontInfo {
  variant_name: string;
  // files: string[]; // not useful in frontend
  preview_path?: string;
}

export interface DecalTextures {
  name: string;
  variants: VariantFrontInfo[];
}