import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from torchvision import datasets, transforms
from torch.utils.data import DataLoader
import torch
from scipy.spatial import KDTree
from skimage.filters import threshold_otsu
from skimage import feature
import random
import os

def load_star_data(csv_file: str, max_stars: int = 100) -> np.ndarray:
    stars_df = pd.read_csv(csv_file)
    stars_df = stars_df[stars_df['magnitude'] <= 6]
    if len(stars_df) >= 5:
        if len(stars_df) > max_stars:
            stars_df = stars_df.nsmallest(max_stars, 'magnitude')
        coordinates = stars_df[['x', 'y', 'z']].values.astype('float32')
        return coordinates
    if stars_df.empty:
        raise ValueError("No stars found with magnitude <= 6.")
    coordinates = stars_df[['x', 'y', 'z']].values.astype('float32')
    return coordinates

def process_cifar10_images(batch_size: int = 4):
    transform = transforms.Compose([
        transforms.Resize((32, 32)),
        transforms.Grayscale(),
        transforms.ToTensor(),
    ])
    dataset = datasets.CIFAR100(root='../data', train=True, download=True, transform=transform)
    dataloader = DataLoader(dataset, batch_size=batch_size, shuffle=True)
    return dataloader, dataset.classes

def extract_image_pattern(image_tensor: torch.Tensor, max_points: int = 10000) -> list[np.ndarray]:
    batch_size = image_tensor.size(0)
    patterns = []
    for i in range(batch_size):
        image = image_tensor[i].squeeze(0).numpy()
        threshold = threshold_otsu(image)
        pattern = image > threshold
        edges = feature.canny(image)
        combined_pattern = pattern | edges
        y_indices, x_indices = np.where(combined_pattern)
        if len(x_indices) > max_points:
            indices = np.random.choice(len(x_indices), size=max_points, replace=False)
            x_indices = x_indices[indices]
            y_indices = y_indices[indices]
        x_norm = x_indices / (image.shape[1] - 1)
        y_norm = y_indices / (image.shape[0] - 1)
        z_norm = np.zeros_like(x_norm)
        pattern_coords = np.stack((x_norm, y_norm, z_norm), axis=1)
        patterns.append(pattern_coords)
    return patterns

def map_pattern_to_stars(pattern_coords_list: list[np.ndarray], star_coords: np.ndarray) -> list[np.ndarray]:
    min_vals = star_coords.min(axis=0)
    max_vals = star_coords.max(axis=0)
    all_selected_star_coords = []
    for pattern_coords in pattern_coords_list:
        pattern_coords_scaled = pattern_coords * (max_vals - min_vals) + min_vals
        tree = KDTree(star_coords)
        _, indices = tree.query(pattern_coords_scaled)
        selected_star_coords = star_coords[indices]
        all_selected_star_coords.append(selected_star_coords)
    return all_selected_star_coords

def generate_constellation() -> None:
    seed_value = 42
    random.seed(seed_value)
    np.random.seed(seed_value)
    torch.manual_seed(seed_value)
    star_coords = load_star_data('../data/stars.csv', max_stars=30)
    dataloader, class_names = process_cifar10_images(batch_size=4)
    os.makedirs('output_plots', exist_ok=True)
    for images, labels in dataloader:
        pattern_coords_list = extract_image_pattern(images)
        constellation_coords_list = map_pattern_to_stars(pattern_coords_list, star_coords)
        for idx, (constellation_coords, label) in enumerate(zip(constellation_coords_list, labels)):
            class_name = class_names[label]
            filename = f'generated_constellation_{idx}_{class_name}.csv'
            np.savetxt(filename, constellation_coords, delimiter=',', header='x,y,z', comments='')
            plot_constellation(constellation_coords, idx, class_name, star_coords)
            save_original_image(images[idx], idx, class_name)
        break

def plot_constellation(coords: np.ndarray, idx: int, class_name: str, star_coords: np.ndarray) -> None:
    x, y, z = coords[:, 0], coords[:, 1], coords[:, 2]
    fig = plt.figure(figsize=(10, 10))
    ax = fig.add_subplot(111, projection='3d')
    ax.scatter(x, y, z, s=50, c='blue', label='Constellation Stars')
    tree = KDTree(coords)
    k = min(2, len(coords) - 1)
    _, indices = tree.query(coords, k=k+1)
    for i in range(len(coords)):
        for j in indices[i][1:]:
            if i < j:
                ax.plot([coords[i, 0], coords[j, 0]],
                        [coords[i, 1], coords[j, 1]],
                        [coords[i, 2], coords[j, 2]],
                        c='gray', alpha=0.8, linewidth=1.5)
    plt.title(f"Generated Constellation {idx}: {class_name.capitalize()}")
    ax.set_xlabel("X Coordinate")
    ax.set_ylabel("Y Coordinate")
    ax.set_zlabel("Z Coordinate")
    plt.legend()
    plt.savefig(f"output_plots/constellation_{idx}_{class_name}.png")
    plt.close()

def save_original_image(image_tensor: torch.Tensor, idx: int, class_name: str) -> None:
    image = image_tensor.squeeze(0).numpy()
    image = (image - image.min()) / (image.max() - image.min())
    plt.imshow(image, cmap='gray')
    plt.title(f"Original Image {idx}: {class_name.capitalize()}")
    plt.axis('off')
    plt.savefig(f"output_plots/original_image_{idx}_{class_name}.png")
    plt.close()

if __name__ == '__main__':
    generate_constellation()