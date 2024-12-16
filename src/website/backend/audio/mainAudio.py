import zipfile
import os
import sys
import time

current_dir = os.path.dirname(os.path.abspath(__file__))
project_dir = os.path.join(current_dir, '..', '..', '..', '..')
sys.path.append(project_dir)

from src.website.backend.audio.extraction import extract_zip, compare_filemidi

def all_midi_files(folder_path):
    midi_files = []
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

def waktu_program_audio(zip_path, extract_to, query):
    start_time = time.time()
    urutan_kemiripan = audio_query(zip_path, extract_to, query)
    end_time = time.time()
    waktu_eksekusi = end_time - start_time
    return urutan_kemiripan, waktu_eksekusi

# Contoh penggunaan
if __name__ == "__main__":
    zip_path = 'audio.zip'  # Path ke file zip
    extract_to = os.path.join(current_dir, 'extracted')  # Folder untuk ekstraksi
    query = 'bach.mid'  # Nama file MIDI target

    urutan_kemiripan, waktu_eksekusi = waktu_program_audio(zip_path, extract_to, query)
    
    for midi_file, similarity in urutan_kemiripan:
        print(f"File: {midi_file}, Similarity: {similarity}%")
    
    print(f"Waktu eksekusi program: {waktu_eksekusi:.2f} detik")

# Contoh Output
# File: src\website\backend\audio\extracted\bach\bach_846.mid, Similarity: 100%

# File: src\website\backend\audio\extracted\albeniz\alb_esp2.mid, Similarity: 98%

# File: src\website\backend\audio\extracted\beeth\beethoven_hammerklavier_1.mid, Similarity: 98%

# File: src\website\backend\audio\extracted\beeth\waldstein_1.mid, Similarity: 98%

# File: src\website\backend\audio\extracted\burgm\burg_sylphen.mid, Similarity: 98%

# File: src\website\backend\audio\extracted\liszt\liz_liebestraum.mid, Similarity: 98%

# File: src\website\backend\audio\extracted\albeniz\alb_se1.mid, Similarity: 97%

# File: src\website\backend\audio\extracted\brahms\br_rhap.mid, Similarity: 97%

# File: src\website\backend\audio\extracted\balakir\islamei.mid, Similarity: 91%

# File: src\website\backend\audio\extracted\grieg\grieg_brooklet.mid, Similarity: 90%

# File: src\website\backend\audio\extracted\grieg\grieg_march.mid, Similarity: 90%

# File: src\website\backend\audio\extracted\schumann\schum_abegg.mid, Similarity: 90%

# File: src\website\backend\audio\extracted\albeniz\alb_esp1.mid, Similarity: 88%

# File: src\website\backend\audio\extracted\liszt\liz_donjuan.mid, Similarity: 79%

# File: src\website\backend\audio\extracted\albeniz\alb_se2.mid, Similarity: 78%

# File: src\website\backend\audio\extracted\beeth\beethoven_les_adieux_1.mid, Similarity: 78%

# File: src\website\backend\audio\extracted\beeth\elise.mid, Similarity: 78%