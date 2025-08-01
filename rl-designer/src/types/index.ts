export interface VariantFrontInfo {
  variant_name: string;
  // files: string[]; // not useful in frontend
  preview_path?: string;
  skin_path?: string;
  chassis_diffuse_path?: string;
}

export interface DecalTextures {
  name: string;
  variants: VariantFrontInfo[];
}