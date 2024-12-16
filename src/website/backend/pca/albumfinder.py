import json
import os
import shutil
from pca import face_recognition
import zipfile
import time

def find_album():
    print("Starting find_album function")

    start_time = time.time()

    # directory
    script_dir = os.path.dirname(os.path.abspath(__file__))

    # load mapper
    mapper_folder = os.path.join(script_dir, '../../uploads/mapper')
    mapper_files = [f for f in os.listdir(mapper_folder) if f.endswith('.json')]

    if not mapper_files:
        print(f"No JSON files found in mapper folder: {mapper_folder}")
        return

    
    mapper_path = os.path.join(mapper_folder, mapper_files[0])
    print(f"Using mapper file: {mapper_path}")

    with open(mapper_path, "r") as file:
        artist_mapping = json.load(file)

   

    # Unzip 
    def unzip_files(zip_folder, extract_to):
        for filename in os.listdir(zip_folder):
            if filename.endswith('.zip'):
                zip_path = os.path.join(zip_folder, filename)
                print(f"Unzipping file: {zip_path}")
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_to)

    
    image_zip = os.path.join(script_dir, '../../uploads/pictures')
    audio_zip = os.path.join(script_dir, '../../uploads/audios')

    image_folder_unzip = os.path.join(script_dir, '../../uploads/pictures')
    audio_folder_unzip = os.path.join(script_dir, '../../uploads/audios')

    # Unzip
    unzip_files(image_zip, image_folder_unzip)
    unzip_files(audio_zip, audio_folder_unzip)

    query_image_folder = os.path.join(script_dir, '../../uploads/queryImage')
    query_image_files = [f for f in os.listdir(query_image_folder) if f.endswith(('.jpg', '.jpeg', '.png'))]

    if not query_image_files:
        print(f"No image files found in query image folder: {query_image_folder}")
        return

    # ambil query image path
    query_image_path = os.path.join(query_image_folder, query_image_files[0])
    print(f"Using query image: {query_image_path}")

    # lakukan face recognition
    closest_image_path, closest_distance = face_recognition(image_folder_unzip, query_image_path)
    print(f"Closest image path: {closest_image_path}, Distance: {closest_distance}")

    # Dapatkan nama folder (artis)
    artist_name = os.path.basename(os.path.dirname(closest_image_path))
    print(f"Identified artist: {artist_name}")

    # Ambil audio folder dari mapper
    artist_info = artist_mapping.get(artist_name, {})
    audio_folder = os.path.join(script_dir, '../../', artist_info.get("audio_folder", ""))

    if not audio_folder:
        print("Audio folder not found in artist mapping")
        return

   
    result_folder = os.path.join(script_dir, '../../resultalbum')

  
    if os.path.exists(result_folder):
        shutil.rmtree(result_folder)
    os.makedirs(result_folder)

    # Copy audio files
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
    execution_time = round(execution_time, 2)
    print(f"Execution time: {execution_time} seconds")


if __name__ == "__main__":
    execution_time = find_album()
    print(f"Execution time: {execution_time} seconds")