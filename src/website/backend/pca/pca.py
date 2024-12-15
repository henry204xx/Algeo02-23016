import os
import numpy as np
from PIL import Image, ImageOps
import time


# Step 1: Preprocess and Standardize Data
def process_dataset(image_folder, width, height):
    all_images = []
    image_paths = []

    # Walk through the folder and its subfolders
    for root, _, files in os.walk(image_folder):
        for f in files:
            if f.lower().endswith(('.png', '.jpg', '.jpeg', '.bmp', '.tiff')):
                image_path = os.path.join(root, f)
                image_paths.append(image_path)

                try:
                    img = Image.open(image_path)
                    img = ImageOps.grayscale(img)  # Convert to grayscale
                    img = img.resize((width, height), Image.LANCZOS)  # Resize
                    all_images.append(np.array(img).flatten())  # Flatten to 1D
                except Exception as e:
                    print(f"Error processing {image_path}: {e}")

    return np.array(all_images), image_paths


def data_centering(images):
    mean_face = np.mean(images, axis=0)
    centered_images = images - mean_face
    return centered_images, mean_face


# Step 2: Perform PCA Using Direct SVD
def pca_svd(centered_images):
    """
    Perform SVD directly on the centered data matrix.
    This avoids explicitly computing the covariance matrix.
    """
    U, S, Vt = np.linalg.svd(centered_images, full_matrices=False)
    return U, S, Vt


def determine_k(S, threshold=0.90):
    """
    Determine the number of principal components (k) to retain 
    based on the variance explained threshold.
    """
    variance_ratio = S**2 / np.sum(S**2)
    cumulative_variance = np.cumsum(variance_ratio)
    k = np.argmax(cumulative_variance >= threshold) + 1
    return k


def project_k_components(Vt, k):
    """
    Select the top-k right singular vectors (principal components).
    """
    return Vt[:k, :].T  # Transpose to get (d x k)


# Step 3: Project Data and Query Image into PCA Space
def project_data(data, Uk):
    """
    Project the data into the PCA space using top-k components.
    """
    return data @ Uk


def process_query(query_image_path, width, height, mean_face):
    """
    Preprocess the query image: grayscale, resize, flatten, and center.
    """
    query_image = Image.open(query_image_path)
    query_image = ImageOps.grayscale(query_image)
    query_image = query_image.resize((width, height), Image.LANCZOS)
    query_image = np.array(query_image).flatten()
    return query_image - mean_face


# Step 4: Perform Recognition Using Euclidean Distance
def closest_image(query_projection, dataset_projections, image_paths):
    """
    Find the closest image in the dataset using Euclidean distance.
    """
    distances = np.linalg.norm(dataset_projections - query_projection, axis=1)
    min_index = np.argmin(distances)
    return image_paths[min_index], distances[min_index]


# Main PCA Face Recognition Function
def face_recognition(image_folder, query_image_path, width=64, height=64, threshold=0.90):
    # Step 1: Load and preprocess images
    images, image_paths = process_dataset(image_folder, width, height)
    centered_images, mean_face = data_centering(images)

    # Step 2: Perform PCA using SVD
    U, S, Vt = pca_svd(centered_images)
    k = determine_k(S, threshold)
    Uk = project_k_components(Vt, k)

    # Step 3: Project dataset and query image into PCA space
    dataset_projections = project_data(centered_images, Uk)
    query_image_centered = process_query(query_image_path, width, height, mean_face)
    query_projection = project_data(query_image_centered.reshape(1, -1), Uk)

    # Step 4: Find the closest image
    closest_image_path, closest_distance = closest_image(query_projection, dataset_projections, image_paths)

    # Output result
    return closest_image_path, closest_distance


# Main Execution
if __name__ == "__main__":
    image_folder = "C:/Users/YOGA/Downloads/pictures4"
    query_image_path = "C:/Users/YOGA/Downloads/barrackobama.jpg"

    start_time = time.time()
    closest_image_path, closest_distance = face_recognition(image_folder, query_image_path)
    print("Closest image:")
    print(f"Image path: {closest_image_path}, Distance: {closest_distance}")
    end_time = time.time()

    print(f"Processing completed in {end_time - start_time:.2f} seconds.")
