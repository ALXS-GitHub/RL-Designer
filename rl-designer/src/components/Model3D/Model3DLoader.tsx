import React, { useState, useEffect } from "react";
import Model3DPreview from "./Model3DPreview";
import { Loading, Error } from "@/components";
import { SUPPORTED_MODELS } from "@/constants/models";
import type { ModelType } from "@/constants/models";
import { PagesMap } from "@/constants/pagesMap";
import usePageStore from "@/stores/pageStore";
import { forwardRef, useImperativeHandle } from "react";
import type { ElementType } from "@/constants/elements";
import useSelectedElementStore from "@/stores/selectedElementStore";
import type { ModelDataConfig, ModelDataPaths, ModelDataSetup } from "@/types/modelData";
import { existsInPublic } from "@/utils/files";

import "./Model3DLoader.scss";

interface PreviewLoaderPublicProps {
    decal: string;
    variant_name: string;
    modelDataConfig?: ModelDataConfig;
    selectedElement: ElementType;
    modelDataPaths: ModelDataPaths;
    modelDataSetup: ModelDataSetup;
}

const PreviewLoaderPublic = ({
    decal,
    variant_name,
    modelDataConfig,
    selectedElement,
    modelDataPaths,
    modelDataSetup,
}: PreviewLoaderPublicProps) => {

    const [isLoadingPublic, setIsLoadingPublic] = useState(true);

    const [modelPath, setModelPath] = useState<string | null>(null);
    const [defaultSkinTexturePath, setDefaultSkinTexturePath] = useState<string | null>(null);
    const [chassisTexturePath, setChassisTexturePath] = useState<string | null>(null);
    const [wheelTexturePath, setWheelTexturePath] = useState<string | null>(null);
    const [tireTexturePath, setTireTexturePath] = useState<string | null>(null);
    const [curvatureTexturePath, setCurvatureTexturePath] = useState<string | null>(null);

    const getPublicFiles = async () => {
        // Define paths for the model and texture based on the decal and variant
        let modelP = `/models/meshes/${variant_name}.fbx`;
        if (selectedElement === "ball") {
            modelP = `/models/meshes/Ball.fbx`;
        }
        const modelExists = await existsInPublic(modelP);
        setModelPath(modelExists ? modelP : null);

        if (selectedElement === "car") {
            if (modelDataPaths.chassisTexturePath) {
                setChassisTexturePath(modelDataPaths.chassisTexturePath);
            } else {
                const chassisExists = await existsInPublic(`/models/textures/chassis/${variant_name}_chassis.png`);
                setChassisTexturePath(chassisExists ? `/models/textures/chassis/${variant_name}_chassis.png` : null);
            }

            const defaultSkinExists = await existsInPublic(`/models/textures/skins/default_${variant_name}_skin.png`);
            setDefaultSkinTexturePath(defaultSkinExists ? `/models/textures/skins/default_${variant_name}_skin.png` : null);

            const wheelExists = await existsInPublic(`/models/textures/wheels/wheels/Cristiano_wheel.png`);
            setWheelTexturePath(wheelExists ? `/models/textures/wheels/wheels/Cristiano_wheel.png` : null);
            const tireExists = await existsInPublic(`/models/textures/wheels/tires/Cristiano_tire.png`);
            setTireTexturePath(tireExists ? `/models/textures/wheels/tires/Cristiano_tire.png` : null);
            const curvatureExists = await existsInPublic(`/models/textures/curvature/${variant_name}_curvature.png`);
            setCurvatureTexturePath(curvatureExists ? `/models/textures/curvature/${variant_name}_curvature.png` : null);
        }
    }

    
    useEffect(() => {
        const fetchModelPath = async () => {
            await getPublicFiles();
            setIsLoadingPublic(false);
        };
        fetchModelPath();
    }, [decal, variant_name, selectedElement]);
    
    if (isLoadingPublic) {
        return <Loading />;
    }

    modelDataPaths.modelPath = modelPath;
    if (!modelDataPaths.skinTexturePath) modelDataPaths.skinTexturePath = defaultSkinTexturePath;
    modelDataPaths.chassisTexturePath = chassisTexturePath;
    modelDataPaths.wheelTexturePath = wheelTexturePath;
    modelDataPaths.tireTexturePath = tireTexturePath;
    modelDataPaths.curvatureTexturePath = curvatureTexturePath;

    if (!modelPath) {
        return <Error message={`Model "${variant_name}" not found.`} />;
    }

    return (
        <Model3DPreview
            key={variant_name}
            modelDataPaths={modelDataPaths}
            modelDataConfig={modelDataConfig}
            modelDataSetup={modelDataSetup}
        />
    )
}



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
    const { decals } = PagesMap[lastPage].useData();
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

    const diffusePath = variantData.preview_path || null;
    const skinPath = variantData.skin_path || null; // skin is not required
    const chassisDiffusePath = variantData.chassis_diffuse_path || null;
    const oneDiffuseSkinPath = variantData.one_diffuse_skin_path || null;

    let texturePath = null;
    const modelDataSetup = {
        decalTextureUV: 0
    };

    if (diffusePath) {
        texturePath = diffusePath;
    } else if (oneDiffuseSkinPath) {
        texturePath = oneDiffuseSkinPath;
        modelDataSetup.decalTextureUV = 1;
    }

    if (!texturePath)
        return (
            <Error
                message={`Texture path not found for variant "${variant_name}" of decal "${decal}".`}
            />
        );

    const tempDataPaths = {
        modelPath: null,
        decalTexturePath: texturePath,
        skinTexturePath: skinPath,
        chassisTexturePath: chassisDiffusePath,
    }

    return (
        <div className={`preview-loader ${className}`}
            key={`${decal}-${variant_name}`}
        >
            <PreviewLoaderPublic
                decal={decal}
                variant_name={variant_name}
                modelDataConfig={modelDataConfig}
                selectedElement={selectedElement}
                modelDataPaths={tempDataPaths}
                modelDataSetup={modelDataSetup}
            />
        </div>
    );
});

export default PreviewLoader;
