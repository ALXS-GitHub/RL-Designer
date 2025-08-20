export interface VariantFrontInfo {
  variant_name: string;
  signature: string;
  files: string[]; // not useful in frontend
  preview_path?: string; // Diffuse
  skin_path?: string;
  chassis_diffuse_path?: string;
  one_diffuse_skin_path?: string; // 1_Diffuse_Skin
  imageseq_subuv_path?: string; // for looper wheel textures
}

export interface DecalTextures {
  name: string;
  variants: VariantFrontInfo[];
}

export interface DecalVariant {
  decal: DecalTextures;
  variant_name: string;
}