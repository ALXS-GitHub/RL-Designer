import React, { useState, useEffect } from "react";
import Model3DPreview from "./Model3DPreview";
import { useParams } from "react-router-dom";
import { Loading, Error } from "@/components";
import useCollection from "@/hooks/useCollection";
import { SUPPORTED_MODELS } from "@/constants/models";
import type { ModelType } from "@/constants/models";
import { PagesMap } from "@/constants/pagesMap";
import usePageStore from "@/stores/pageStore";
import { convertFileSrc } from "@tauri-apps/api/core";
import { resolveImagePath } from "@/utils/images";
import { forwardRef, useImperativeHandle } from "react";
import type { ElementType } from "@/constants/elements";
import useSelectedElementStore from "@/stores/selectedElementStore";
import type { ModelDataConfig } from "@/types/modelData";

import "./Model3DLoader.scss";

interface PreviewLoaderProps {
    decal: string;
    variant_name: string;
    className?: string;
    modelDataConfig?: ModelDataConfig;
}

const PreviewLoader = forwardRef<any, PreviewLoaderProps>(({
    decal,
    variant_name,
    className = "",
    modelDataConfig,
},ref) => {
    const { lastPage } = usePageStore();
    const { selectedElement } = useSelectedElementStore();
    const { decals, isLoading, isError } = PagesMap[lastPage].useData();
    const [variantList, setVariantList] = useState<string[]>([]);

    const isValidModel = (variant_name: string) => {
        if (!variant_name) return false;
        if (selectedElement !== "car") return true;
        return Object.values(SUPPORTED_MODELS).includes(
            variant_name as ModelType
        );
    };

    const onChangeVariant = (dir: -1 | 1) => {
        const currentIndex = variantList.indexOf(variant_name);
        let newIndex = currentIndex + dir;
        newIndex = (newIndex + variantList.length) % variantList.length; // Wrap around if out of bounds

        return variantList[newIndex]; // Return the new variant name
    };

    // imperative handle
    useImperativeHandle(ref, () => ({
        onChangeVariant,
    }));

    useEffect(() => {
        // Fetch all variants for the decal
        const fetchVariants = async () => {
            const variants =
                decals
                    .find((d) => d.name === decal)
                    ?.variants.map((v) => v.variant_name) || [];
            setVariantList(variants);
        };

        fetchVariants();
    }, [decal, decals]);

    if (!isValidModel(variant_name)) {
        return (
            <Error message={`Model "${variant_name}" is not supported.`} />
        );
    }

    const decalData = decals.find((d) => d.name === decal);
    if (!decalData)
        return (
            <Error message={`Decal "${decal}" not found in collection.`} />
        );

    const variantData = decalData.variants.find(
        (v) => v.variant_name === variant_name
    );
    if (!variantData)
        return (
            <Error
                message={`Variant "${variant_name}" not found for decal "${decal}".`}
            />
        );

    const texturePath = variantData.preview_path;
    const skinPath = variantData.skin_path || null; // skin is not required
    const chassisDiffusePath = variantData.chassis_diffuse_path || null;
    if (!texturePath)
        return (
            <Error
                message={`Texture path not found for variant "${variant_name}" of decal "${decal}".`}
            />
        );

    // Define paths for the model and texture based on the decal and variant
    let modelPath = `/models/meshes/${variant_name}.obj`;
    if (selectedElement === "ball") {
        modelPath = `/models/meshes/Ball.obj`;
    }

    // TODO : check if exists... (but normally yes as we also suppose modelPath exists)
    let chassisTexturePath = null;
    let wheelTexturePath = null;
    let tireTexturePath = null;
    if (selectedElement === "car") {
        chassisTexturePath = chassisDiffusePath ? chassisDiffusePath : `/models/textures/chassis/${variant_name}_chassis.png`;
        // For the moment the wheel on the models are defined to Cristiano
        wheelTexturePath = `/models/textures/wheels/wheels/Cristiano_wheel.png`;
        tireTexturePath = `/models/textures/wheels/tires/Cristiano_tire.png`;
    }


    const modelDataPaths = {
        modelPath: modelPath,
        decalTexturePath: texturePath,
        skinTexturePath: skinPath,
        chassisTexturePath: chassisTexturePath,
        wheelTexturePath: wheelTexturePath,
        tireTexturePath: tireTexturePath,
    }

    if (isLoading) return <Loading />;
    if (isError) return <Error message={isError.message} />;

    return (
        <div className={`preview-loader ${className}`}>
            <Model3DPreview
                key={variant_name}
                modelDataPaths={modelDataPaths}
                modelDataConfig={modelDataConfig}
            />
        </div>
    );
});

export default PreviewLoader;
