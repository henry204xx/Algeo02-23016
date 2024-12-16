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
                    img = ImageOps.grayscale(img)  # grayscale
                    img = img.resize((width, height), Image.BICUBIC)  # resize
                    all_images.append(np.array(img).flatten())  # flatten
                except Exception as e:
                    print(f"Error {image_path}: {e}")

    return np.array(all_images), image_paths


def data_centering(images):
    
    mean_face = np.mean(images, axis=0)
    centered_images = images - mean_face
    return centered_images, mean_face


# Step 2: Perform PCA Using SVD
def pca_svd(standardized_images):
   
    covariance_matrix = np.cov(standardized_images, rowvar=False)
    U, S, Vt = np.linalg.svd(covariance_matrix)
    return U, S, Vt


def determine_k(S, threshold=0.90):
    
    varianceratio = S / np.sum(S)
    variancesum = np.cumsum(varianceratio)
    k = np.argmax(variancesum >= threshold) + 1
    return k


def project_k_components(U, k): 
# Projeksi data ke k top components .
    return U[:, :k]


# Step 3: Project Data and Query Image into PCA Space
def project_data(data, Uk):
    
    return data @ Uk


def process_query(query_image_path, width, height, mean_face):
    
    query_image = Image.open(query_image_path) 
    query_image = ImageOps.grayscale(query_image) #grayscale
    query_image = query_image.resize((width, height), Image.BICUBIC) #resize
    query_image = np.array(query_image).flatten() #flatten
    return query_image - mean_face


# Step 4: Perform Recognition Using Euclidean Distance
def euclidean_dist(q, z):

    return np.linalg.norm(q - z)


def closest_image(query_projection, dataset_projections, image_paths):
    distances = [
        euclidean_dist(query_projection, projection)
        for projection in dataset_projections
    ]
    min_index = np.argmin(distances) 
    return image_paths[min_index], distances[min_index] 


# Main PCA Face Recognition Function
def face_recognition(image_folder, query_image_path, width=64, height=64):

    # Step 1: Load and preprocess images
    images, image_paths = process_dataset(image_folder, width, height)
    standardized_images, mean_face = data_centering(images)

    # Step 2: Perform PCA
    U, S, Vt = pca_svd(standardized_images)
    k = determine_k(S, threshold=0.90)
    Uk = project_k_components(U, k)

    # Step 3: Project training images into PCA space
    dataset_projections = project_data(standardized_images, Uk)

    # Step 4: Preprocess and project query image
    query_image_centered = process_query(query_image_path, width, height, mean_face)
    query_projection = project_data(query_image_centered.reshape(1, -1), Uk)

    # Step 5: Find closest images using Euclidean distance
    closest_image_path, closest_distance = closest_image(query_projection, dataset_projections, image_paths)

# Output result

    return closest_image_path, closest_distance


# Main Execution
# if __name__ == "__main__":
#     image_folder = "C:/Users/YOGA/Downloads/pictures4"
#     query_image_path = "C:/Users/YOGA/Downloads/barrackobama.jpg"

#     start_time = time.time()
#     closest_image_path, closest_distance = face_recognition(image_folder, query_image_path)
#     print("Closest image:")
#     print(f"Image path: {closest_image_path}, Distance: {closest_distance}")
#     end_time = time.time()

    print(f"Processing completed in {end_time - start_time:.2f} seconds.")
