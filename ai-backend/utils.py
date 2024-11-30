import os
import random
import sys
from typing import Sequence, Mapping, Any, Union
import torch
from nodes import NODE_CLASS_MAPPINGS
import folder_paths
from PIL import Image, ImageOps, ImageSequence
from PIL.PngImagePlugin import PngInfo
import numpy as np
from comfy.cli_args import args


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
        from main import load_extra_path_config
    except ImportError:
        print("Could not import load_extra_path_config from main.py. Looking in utils.extra_config instead.")
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


class SaveImage:
    def __init__(self):
        self.output_dir = folder_paths.get_output_directory()
        self.type = "output"
        self.prefix_append = ""
        self.compress_level = 4

    @classmethod
    def INPUT_TYPES(s):
        return {"required": 
                    {"images": ("IMAGE", ),
                     "filename_prefix": ("STRING", {"default": "ComfyUI"})},
                "hidden": {"prompt": "PROMPT", "extra_pnginfo": "EXTRA_PNGINFO"},
                }

    RETURN_TYPES = ()
    FUNCTION = "save_images"

    OUTPUT_NODE = True

    CATEGORY = "image"

    def save_images(self, images, filename_prefix="ComfyUI", prompt=None, extra_pnginfo=None):
        filename_prefix += self.prefix_append
        full_output_folder, filename, counter, subfolder, filename_prefix = folder_paths.get_save_image_path(filename_prefix, self.output_dir, images[0].shape[1], images[0].shape[0])
        results = list()
        for (batch_number, image) in enumerate(images):
            i = 255. * image.cpu().numpy()
            img = Image.fromarray(np.clip(i, 0, 255).astype(np.uint8))
            metadata = None
            if not args.disable_metadata:
                metadata = PngInfo()
                if prompt is not None:
                    metadata.add_text("prompt", json.dumps(prompt))
                if extra_pnginfo is not None:
                    for x in extra_pnginfo:
                        metadata.add_text(x, json.dumps(extra_pnginfo[x]))

            filename_with_batch_num = filename.replace("%batch_num%", str(batch_number))
            file = f"{filename_with_batch_num}_{counter:05}_.png"
            img.save(os.path.join(full_output_folder, file), pnginfo=metadata, compress_level=self.compress_level)
            results.append({
                "filename": file,
                "subfolder": subfolder,
                "type": self.type
            })
            counter += 1

        return { "ui": { "images": results } }


class Generator:

    def __init__(self, ckpt_name="CounterfeitV30_v30.safetensors", vae_name="vae-ft-mse-840000-ema-pruned.ckpt"):
        with torch.inference_mode():
            checkpointloadersimple = NODE_CLASS_MAPPINGS["CheckpointLoaderSimple"]()
            self.ckpt_loader = checkpointloadersimple.load_checkpoint(ckpt_name=ckpt_name)

            vaeloader = NODE_CLASS_MAPPINGS["VAELoader"]()
            self.vae_loader = vaeloader.load_vae(vae_name=vae_name)

            self.lineart_prep = NODE_CLASS_MAPPINGS["LineArtPreprocessor"]()


    def __call__(self, prompt="best quality, simple, girl, headshot", negative="worst quality, text, watermark, signature", dims=(512, 768), seed=random.randint(1, 2**64), steps=20, cfg=8, sampler="euler"):
        with torch.inference_mode():

            emptylatentimage = NODE_CLASS_MAPPINGS["EmptyLatentImage"]()
            emptylatentimage_5 = emptylatentimage.generate(
                width=dims[0], height=dims[1], batch_size=1
            )

            cliptextencode = NODE_CLASS_MAPPINGS["CLIPTextEncode"]()
            cliptextencode_6 = cliptextencode.encode(
                text=prompt,
                clip=get_value_at_index(self.ckpt_loader, 1),
            )

            cliptextencode_7 = cliptextencode.encode(
                text=negative,
                clip=get_value_at_index(self.ckpt_loader, 1),
            )


            ksampler = NODE_CLASS_MAPPINGS["KSampler"]()
            vaedecode = NODE_CLASS_MAPPINGS["VAEDecode"]()
            saveimage = SaveImage()

            ksampler_3 = ksampler.sample(
                seed=seed,
                steps=steps,
                cfg=cfg,
                sampler_name=sampler,
                scheduler="normal",
                denoise=1,
                model=get_value_at_index(self.ckpt_loader, 0),
                positive=get_value_at_index(cliptextencode_6, 0),
                negative=get_value_at_index(cliptextencode_7, 0),
                latent_image=get_value_at_index(emptylatentimage_5, 0),
            )

            vaedecode_8 = vaedecode.decode(
                samples=get_value_at_index(ksampler_3, 0),
                vae=get_value_at_index(self.vae_loader, 0),
            )

            saveimage_9 = saveimage.save_images(
                filename_prefix="ComfyUI", images=get_value_at_index(vaedecode_8, 0)
            )

            lineartpreprocessor_13 = self.lineart_prep.execute(
                coarse="disable",
                resolution=512,
                image=get_value_at_index(vaedecode_8, 0),
            )

if __name__ == "__main__":
    import_custom_nodes()
    gen = Generator()
    gen()
