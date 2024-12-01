import torch as pt
import torchvision.transforms as transforms
from torchvision import models
from PIL import Image
import matplotlib.pyplot as plt
from time import time


def plot_feature_maps(feature_maps, max_features=None, cols=4, cmap='viridis'):

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
        plt.title(f'Feature Map {i+1}')
        plt.axis('off')
    
    plt.tight_layout()
    plt.show()


class Detector:
    def __init__(self):
        weights = models.EfficientNet_V2_S_Weights.IMAGENET1K_V1
        self.model = models.efficientnet_v2_s(weights, progress=True)
        self.model.eval()
        self.preprocess = weights.transforms()
        self.categories = weights.meta["categories"]

    def __call__(self, image_path):
        image = Image.open(image_path).convert('RGB')
        input_tensor = preprocess(image).unsqueeze(0)
        with pt.no_grad():
            outputs, feature_maps = self.model(input_tensor)
        return feature_maps

    def forward(self, image_path):
        image = Image.open(image_path).convert('RGB')
        input_tensor = preprocess(image).unsqueeze(0)
        with pt.no_grad():
            outputs, feature_maps = self.model(input_tensor)
        return outputs
