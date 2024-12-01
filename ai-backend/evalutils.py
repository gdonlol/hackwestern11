import torch as pt
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import matplotlib.pyplot as plt
from time import time


def norm(x):
    x -= x.min()
    x /= x.max()
    return x


def plot_feature_maps(feature_maps, max_features=None, cols=4, cmap="viridis"):

    if feature_maps.dim() == 4:
        feature_maps = feature_maps.squeeze(0)
    feature_maps = feature_maps.detach().cpu()
    
    if max_features is not None:
        feature_maps = feature_maps[:max_features]
    
    num_maps = feature_maps.shape[0]
    rows = (num_maps + cols - 1) // cols
    
    plt.figure(figsize=(4 * cols, 4 * rows))
    plt.subplots_adjust(wspace=0.1, hspace=0.2)
    
    for i in range(num_maps):
        plt.subplot(rows, cols, i+1)
        plt.imshow(feature_maps[i], cmap=cmap)
        plt.title(f"Feature Map {i+1}")
        plt.axis("off")
    
    plt.tight_layout()
    plt.show()


class Detector:
    def __init__(self):
        weights = models.EfficientNet_V2_S_Weights.IMAGENET1K_V1
        self.model = models.efficientnet_v2_s(weights, progress=True)
        self.model.eval()
        #self.preprocess = weights.transforms()
        self.resize = transforms.Resize((768, 512))
        self.totensor = transforms.ToTensor()
        self.categories = weights.meta["categories"]

    def __call__(self, image_path):
        image = Image.open(image_path).convert("RGB")
        input_tensor = self.resize(image)
        input_tensor = self.totensor(input_tensor).unsqueeze(0)
        with pt.no_grad():
            outputs, feature_maps = self.model(input_tensor)
        return feature_maps

    def forward(self, image_path):
        image = Image.open(image_path).convert("RGB")
        input_tensor = self.resize(image)
        input_tensor = self.totensor(input_tensor).unsqueeze(0)
        with pt.no_grad():
            outputs, feature_maps = self.model(input_tensor)
        return outputs


def test(detector, target_path, actual_path, layer=3):
    target_maps = detector(target_path)[layer][0]
    actual_maps = detector(actual_path)[layer][0]
    dif_maps = pt.abs(target_maps - actual_maps)
    loss = dif_maps.mean()
    dif_map = norm(dif_maps.sum(dim=0))
    return loss, dif_map


class Scorer:
    def __init__(self, compare_dir="compare", layer=3, compress_level=4):
        self.detector = Detector()
        self.compare_dir = compare_dir
        self.layer = layer
        self.compress_level = compress_level

    def __call__(self):
        loss, dif_map = test(self.detector, f"{self.compare_dir}/lineart.png", f"{self.compare_dir}/drawing.png", self.layer)
        dif_img = Image.fromarray((dif_map * 255).cpu().numpy().astype("u1"))
        dif_img.save(f"{self.compare_dir}/difmap.png", compress_level=self.compress_level)
        score = pt.exp(-loss / 10)
        return score.item(), loss.item()


if __name__ == "__main__":
    detector = Detector()
    losses = [test(detector, "a.png", f"a{i}.png")[0] for i in range(5)]
