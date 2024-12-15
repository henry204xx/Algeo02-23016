import json
import os
import shutil
from pca import face_recognition
import zipfile

def find_album():
    # Load the artist mapping from mapper.json
    mapper_folder = "src/website/uploads/mapper"
    mapper_files = [f for f in os.listdir(mapper_folder) if f.endswith('.json')]

    if not mapper_files:
        print(f"No JSON files found in mapper folder: {mapper_folder}")
        return

    # Assuming we take the first JSON file found in the mapper folder
    mapper_path = os.path.join(mapper_folder, mapper_files[0])

    with open(mapper_path, "r") as file:
        artist_mapping = json.load(file)

    # Define the image folder and query image path

    # Unzip any .zip files in the pictures and audios folders
    def unzip_files(zip_folder, extract_to):
        for filename in os.listdir(zip_folder):
            if filename.endswith('.zip'):
                zip_path = os.path.join(zip_folder, filename)
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_to)

    # Define the zip folders and extraction paths
    image_zip = "src/website/uploads/pictures"
    audio_zip = "src/website/uploads/audios"

    image_folder_unzip = "src/website/uploads/pictures"
    audio_folder_unzip = "src/website/uploads/audios"

    # Unzip the files
    unzip_files(image_zip, image_folder_unzip)
    unzip_files(audio_zip, audio_folder_unzip)

    image_folder = "src/website/uploads/pictures/pictures4"

    query_image_folder = "src/website/uploads/queryImage"
    query_image_files = [f for f in os.listdir(query_image_folder) if f.endswith(('.jpg', '.jpeg', '.png'))]

    if not query_image_files:
        print(f"No image files found in query image folder: {query_image_folder}")
        return

    # Assuming we take the first image file found in the query image folder
    query_image_path = os.path.join(query_image_folder, query_image_files[0])

    # Perform face recognition to find the closest image
    closest_image_path, closest_distance = face_recognition(image_folder, query_image_path)

    # Extract the artist name from the closest image path
    artist_name = os.path.basename(os.path.dirname(closest_image_path))

    # Get the corresponding audio folder for the identified artist
    audio_folder = artist_mapping.get(artist_name, {}).get("audio_folder")

    if not audio_folder:
        print("Audio folder not found in artist mapping")
        return

    # Define the result folder path at the same level as uploads
    result_folder = "src/website/result"

    # Replace the existing result folder if it exists
    if os.path.exists(result_folder):
        shutil.rmtree(result_folder)
    os.makedirs(result_folder)

    # Copy the content of the audio folder to the result folder
    if os.path.exists(audio_folder):
        for filename in os.listdir(audio_folder):
            src_file = os.path.join(audio_folder, filename)
            dst_file = os.path.join(result_folder, filename)
            shutil.copy(src_file, dst_file)
    else:
        print("Audio folder not found")

    print(f"Closest image path: {closest_image_path}")
    print(f"Artist name: {artist_name}")
    print(f"Audio folder: {audio_folder}")

# Call the function
find_album()