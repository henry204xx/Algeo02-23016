import json
import os
from pca import face_recognition

# Load the artist mapping from mapper.json
with open("C:/Users/YOGA/Downloads/temp/mapper.json", "r") as file:
    artist_mapping = json.load(file)

# Define the image folder and query image path
image_folder = "C:/Users/YOGA/Downloads/pictures4"
query_image_path = "C:/Users/YOGA/Downloads/pictures4/Alvaro Morte/Alvaro Morte34_242.jpg"

# Perform face recognition to find the closest image
closest_image_path, closest_distance = face_recognition(image_folder, query_image_path)

# Extract the artist name from the closest image path
artist_name = os.path.basename(os.path.dirname(closest_image_path))

# Get the corresponding audio folder for the identified artist
audio_folder = artist_mapping.get(artist_name, {}).get("audio_folder", "Audio folder not found")

print(f"Closest image path: {closest_image_path}")
print(f"Artist name: {artist_name}")
print(f"Audio folder: {audio_folder}")