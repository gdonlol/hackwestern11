import os
import random
import sys
from typing import Sequence, Mapping, Any, Union
import torch


def get_value_at_index(obj: Union[Sequence, Mapping], index: int) -> Any:
    try:
        return obj[index]
    except KeyError:
        return obj["result"][index]


def find_path(name: str, path: str = None) -> str:
    if path is None:
        path = os.getcwd()
    if name in os.listdir(path):
        path_name = os.path.join(path, name)
        print(f"{name} found: {path_name}")
        return path_name
    parent_directory = os.path.dirname(path)
    if parent_directory == path:
        return None
    return find_path(name, parent_directory)


def add_comfyui_directory_to_sys_path() -> None:
    comfyui_path = find_path("ComfyUI")
    if comfyui_path is not None and os.path.isdir(comfyui_path):
        sys.path.append(comfyui_path)
        print(f"'{comfyui_path}' added to sys.path")


def add_extra_model_paths() -> None:
    try:
        from infer import load_extra_path_config
    except ImportError:
        print(
            "Could not import load_extra_path_config from infer.py. Looking in utils.extra_config instead."
        )
        from utils.extra_config import load_extra_path_config
    extra_model_paths = find_path("extra_model_paths.yaml")
    if extra_model_paths is not None:
        load_extra_path_config(extra_model_paths)
    else:
        print("Could not find the extra_model_paths config file.")


add_comfyui_directory_to_sys_path()
add_extra_model_paths()


def import_custom_nodes() -> None:
    import asyncio
    import execution
    from nodes import init_custom_nodes
    import server
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    server_instance = server.PromptServer(loop)
    execution.PromptQueue(server_instance)
    init_custom_nodes()


from nodes import NODE_CLASS_MAPPINGS


def infer():
    import_custom_nodes()
    with torch.inference_mode():
        checkpointloadersimple = NODE_CLASS_MAPPINGS["CheckpointLoaderSimple"]()
        checkpointloadersimple_4 = checkpointloadersimple.load_checkpoint(
            ckpt_name="CounterfeitV30_v30.safetensors"
        )

        emptylatentimage = NODE_CLASS_MAPPINGS["EmptyLatentImage"]()
        emptylatentimage_5 = emptylatentimage.generate(
            width=512, height=768, batch_size=1
        )

        cliptextencode = NODE_CLASS_MAPPINGS["CLIPTextEncode"]()
        cliptextencode_6 = cliptextencode.encode(
            text="best quality, simple, girl, headshot",
            clip=get_value_at_index(checkpointloadersimple_4, 1),
        )

        cliptextencode_7 = cliptextencode.encode(
            text="worst quality, text, watermark, signature",
            clip=get_value_at_index(checkpointloadersimple_4, 1),
        )

        vaeloader = NODE_CLASS_MAPPINGS["VAELoader"]()
        vaeloader_10 = vaeloader.load_vae(vae_name="vae-ft-mse-840000-ema-pruned.ckpt")

        ksampler = NODE_CLASS_MAPPINGS["KSampler"]()
        vaedecode = NODE_CLASS_MAPPINGS["VAEDecode"]()
        saveimage = NODE_CLASS_MAPPINGS["SaveImage"]()
        lineartpreprocessor = NODE_CLASS_MAPPINGS["LineArtPreprocessor"]()

        ksampler_3 = ksampler.sample(
            seed=random.randint(1, 2**64),
            steps=20,
            cfg=8,
            sampler_name="euler",
            scheduler="normal",
            denoise=1,
            model=get_value_at_index(checkpointloadersimple_4, 0),
            positive=get_value_at_index(cliptextencode_6, 0),
            negative=get_value_at_index(cliptextencode_7, 0),
            latent_image=get_value_at_index(emptylatentimage_5, 0),
        )

        vaedecode_8 = vaedecode.decode(
            samples=get_value_at_index(ksampler_3, 0),
            vae=get_value_at_index(vaeloader_10, 0),
        )

        saveimage_9 = saveimage.save_images(
            filename_prefix="ComfyUI", images=get_value_at_index(vaedecode_8, 0)
        )

        lineartpreprocessor_13 = lineartpreprocessor.execute(
            coarse="disable",
            resolution=512,
            image=get_value_at_index(vaedecode_8, 0),
        )


if __name__ == "__infer__":
    infer()
