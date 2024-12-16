import zipfile
import os
import sys
import time
import shutil
from multiprocessing import Pool
from urllib.parse import quote  

# Setting up project directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.join(current_dir, '..', '..', '..', '..')
sys.path.append(project_dir)

from src.website.backend.audio.extraction import extract_zip, compare_filemidi

def all_midi_files(folder_path):
    """Find all MIDI files in the given folder."""
    midi_files = []
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith('.mid'):
                midi_file_path = os.path.join(root, file)
                midi_files.append(midi_file_path)
    return midi_files

def sort_similarity(target_file, zip_folder):
    """Compare and sort MIDI files by similarity to the target file."""
    all_midi_files_list = all_midi_files(zip_folder)
    similarities = []
    for midi_file in all_midi_files_list:
        similarity = compare_filemidi(target_file, midi_file)
        similarities.append((midi_file, similarity))
    similarities.sort(key=lambda x: x[1], reverse=True)
    
    return similarities

def audio_query(zip_path, extract_to, query):
    """Extract ZIP file and perform similarity comparison."""
    extract_zip(zip_path, extract_to)
    target_file = os.path.join(project_dir, 'src', 'website', 'uploads', 'audios', query)
    target_file = os.path.abspath(target_file)
    
    if os.path.exists(target_file):
        urutan_kemiripan = sort_similarity(target_file, extract_to)
        return urutan_kemiripan
    else:
        print(f"File {query} tidak ditemukan di src/website/uploads/audios.")
        return []

def compare_midi_files(args):
    """Helper function to compare MIDI files for multiprocessing."""
    target_file, midi_file = args
    similarity = compare_filemidi(target_file, midi_file)
    return midi_file, similarity

def speed_program(zip_path, extract_to, query):
    """Optimized similarity comparison using multiprocessing."""
    extract_zip(zip_path, extract_to)
    target_file = os.path.join(project_dir, 'src', 'website', 'uploads', 'queryMusic', query)
    target_file = os.path.abspath(target_file)
    
    if not os.path.exists(target_file):
        print(f"File {query} tidak ditemukan di src/website/uploads/queryMusic.")
        return []

    all_midi_files_list = all_midi_files(extract_to)
    args = [(target_file, midi_file) for midi_file in all_midi_files_list]
    
    with Pool() as pool:
        results = pool.map(compare_midi_files, args)
    
    results.sort(key=lambda x: x[1], reverse=True)
    return results

def waktu_program_audio(zip_path, extract_to, query, use_speed_program=False):
    """Measure execution time of similarity comparison."""
    start_time = time.time()
    if use_speed_program:
        urutan_kemiripan = speed_program(zip_path, extract_to, query)
    else:
        urutan_kemiripan = audio_query(zip_path, extract_to, query)
    end_time = time.time()
    waktu_eksekusi = end_time - start_time
    return urutan_kemiripan, waktu_eksekusi

def copy_results_to_result_folder(results):
    """Copy MIDI files to result folder, adding similarity percentage to filenames."""
    result_folder = os.path.join(project_dir, 'src', 'website', 'resultaudio')
    
    # Clear the result folder if it already exists
    if os.path.exists(result_folder):
        shutil.rmtree(result_folder)
    os.makedirs(result_folder)

    # Sort results in descending order based on similarity
    results.sort(key=lambda x: x[1], reverse=True)
    
    # Copy files with similarity percentage as the prefix in filename
    for midi_file, similarity in results:
        # Extract the filename
        filename = os.path.basename(midi_file)
        # Prefix filename with similarity percentage
        similarity_prefix = f"{similarity:.2f}%"  # Format similarity to 2 decimal places
        new_filename = f"{similarity_prefix}_{filename}"
        # Sanitize the new filename (encode special characters)
        new_filename = quote(new_filename)
        # Define the destination path
        destination_path = os.path.join(result_folder, new_filename)
        # Copy the file with the new name
        shutil.copy(midi_file, destination_path)

# Main Execution
if __name__ == "__main__":
    start_time = time.time()

    # Define directories
    uploads_dir = os.path.join(project_dir, 'src', 'website', 'uploads', 'audios')
    zip_files = [f for f in os.listdir(uploads_dir) if f.lower().endswith('.zip')]
    
    if not zip_files:
        raise FileNotFoundError("Tidak ada file zip di dalam folder 'src/website/uploads/audios'.")
    
    zip_path = os.path.join(uploads_dir, zip_files[0])

    extract_to = os.path.join(current_dir, 'extracted')
    query_dir = os.path.join(project_dir, 'src', 'website', 'uploads', 'queryMusic')
    query_files = [f for f in os.listdir(query_dir) if f.lower().endswith('.mid')]
    
    if not query_files:
        raise FileNotFoundError("Tidak ada file MIDI di dalam folder 'src/website/uploads/queryMusic'.")
    
    query = query_files[0]

    # Run the similarity comparison with multiprocessing
    urutan_kemiripan_speed, waktu_eksekusi_speed = waktu_program_audio(zip_path, extract_to, query, use_speed_program=True)
    
    # Display the results
    print("Hasil dengan optimasi multiprocessing:")
    for midi_file, similarity in urutan_kemiripan_speed:
        print(f"File: {midi_file}, Similarity: {similarity:.2f}%")
    
    print(f"Waktu eksekusi program dengan optimasi: {waktu_eksekusi_speed:.2f} detik")
    
    # Copy results to the result folder with similarity percentage in filenames
    copy_results_to_result_folder(urutan_kemiripan_speed)
    
    # Remove the 'extracted' folder
    if os.path.exists(extract_to):
        shutil.rmtree(extract_to)

    # Calculate total execution time
    end_time = time.time()
    execution_time = end_time - start_time
    print(f"Execution time: {execution_time:.2f} seconds")
