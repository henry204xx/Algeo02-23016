import json
import os
import shutil
from pca import face_recognition
import zipfile
import time

def find_album():
    print("Starting find_album function")

    start_time = time.time()

    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # Load the artist mapping from mapper.json
    mapper_folder = os.path.join(script_dir, '../../uploads/mapper')
    mapper_files = [f for f in os.listdir(mapper_folder) if f.endswith('.json')]

    if not mapper_files:
        print(f"No JSON files found in mapper folder: {mapper_folder}")
        return

    # Assuming we take the first JSON file found in the mapper folder
    mapper_path = os.path.join(mapper_folder, mapper_files[0])
    print(f"Using mapper file: {mapper_path}")

    with open(mapper_path, "r") as file:
        artist_mapping = json.load(file)

    # Define the image folder and query image path

    # Unzip any .zip files in the pictures and audios folders
    def unzip_files(zip_folder, extract_to):
        for filename in os.listdir(zip_folder):
            if filename.endswith('.zip'):
                zip_path = os.path.join(zip_folder, filename)
                print(f"Unzipping file: {zip_path}")
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_to)

    # Define the zip folders and extraction paths
    image_zip = os.path.join(script_dir, '../../uploads/pictures')
    audio_zip = os.path.join(script_dir, '../../uploads/audios')

    image_folder_unzip = os.path.join(script_dir, '../../uploads/pictures')
    audio_folder_unzip = os.path.join(script_dir, '../../uploads/audios')

    # Unzip the files
    unzip_files(image_zip, image_folder_unzip)
    unzip_files(audio_zip, audio_folder_unzip)

    image_folder = os.path.join(script_dir, '../../uploads/pictures/pictures4')
    query_image_folder = os.path.join(script_dir, '../../uploads/queryImage')
    query_image_files = [f for f in os.listdir(query_image_folder) if f.endswith(('.jpg', '.jpeg', '.png'))]

    if not query_image_files:
        print(f"No image files found in query image folder: {query_image_folder}")
        return

    # Assuming we take the first image file found in the query image folder
    query_image_path = os.path.join(query_image_folder, query_image_files[0])
    print(f"Using query image: {query_image_path}")

    # Perform face recognition to find the closest image
    closest_image_path, closest_distance = face_recognition(image_folder, query_image_path)
    print(f"Closest image path: {closest_image_path}, Distance: {closest_distance}")

    # Extract the artist name from the closest image path
    artist_name = os.path.basename(os.path.dirname(closest_image_path))
    print(f"Identified artist: {artist_name}")

    # Get the corresponding audio folder for the identified artist
    audio_folder = os.path.join(script_dir, '../../uploads/audios', artist_mapping.get(artist_name, {}).get("audio_folder", ""))

    if not audio_folder:
        print("Audio folder not found in artist mapping")
        return

    # Define the result folder path at the same level as uploads
    result_folder = os.path.join(script_dir, '../../result')

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

    print(f"Album finder completed. Closest image path: {closest_image_path}, Artist name: {artist_name}, Audio folder: {audio_folder}")

    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time} seconds")

# Export the function
if __name__ == "__main__":
    execution_time = find_album()
    print(f"Execution time: {execution_time} seconds")