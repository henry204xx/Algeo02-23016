import zipfile
import os
import sys

# Menambahkan path ke sys.path untuk mengimpor modul dari parent directory
current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.join(current_dir, '..', '..', '..', '..')
sys.path.append(project_dir)

from src.website.backend.audio.extraction import extract_zip, compare_filemidi

def all_midi_files(folder_path):
    midi_files = []
    # Gunakan os.walk untuk menjelajahi folder 'extracted'
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            if file.lower().endswith('.mid'):
                midi_file_path = os.path.join(root, file)
                midi_files.append(midi_file_path)
    return midi_files

def sort_similarity(target_file, zip_folder):
    all_midi_files_list = all_midi_files(zip_folder)  # Mencari semua file MIDI dalam ZIP
    similarities = []
    for midi_file in all_midi_files_list:
        similarity = compare_filemidi(target_file, midi_file)
        similarities.append((midi_file, similarity))
    similarities.sort(key=lambda x: x[1], reverse=True)  # Mengurutkan dari yang paling mirip hingga tidak mirip dengan persentase kemiripan
    
    return similarities

def audio_query(zip_path, extract_to, query):
    extract_zip(zip_path, extract_to)
    target_file = os.path.join('src', 'website', 'uploads', 'audios', query)
    target_file = os.path.abspath(target_file)
    
    if os.path.exists(target_file):
        urutan_kemiripan = sort_similarity(target_file, extract_to)
        return urutan_kemiripan
    else:
        print(f"File {query} tidak ditemukan di src/website/uploads/audios.")
        return []

# Contoh penggunaan
if __name__ == "__main__":
    zip_path = 'audio.zip'  # Path ke file zip
    extract_to = os.path.join(current_dir, 'extracted')  # Folder untuk ekstraksi
    query = 'bach.mid'  # Nama file MIDI target

    # Panggil fungsi audio_query
    urutan_kemiripan = audio_query(zip_path, extract_to, query)
    midi_files = all_midi_files(extract_to)
    
    print(midi_files)  # Debugging untuk melihat file MIDI yang ditemukan
    # Print urutan kemiripan
    for midi_file, similarity in urutan_kemiripan:
        print(f"File: {midi_file}, Similarity: {similarity}%")
