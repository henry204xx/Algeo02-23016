import zipfile
import os
import numpy as np
from process import process_midi_file 

def extract_zip(zip_path, extract_to='extracted'):
    base_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.join(base_dir, '..', '..', '..', '..')
    zip_path = os.path.join(project_root, 'src', 'website', 'uploads', 'audios', zip_path)
    extract_to = os.path.join(base_dir, extract_to)
    if not os.path.exists(extract_to):
        os.makedirs(extract_to)
    try:
        with zipfile.ZipFile(zip_path, 'r') as zip_ref:
            zip_ref.extractall(extract_to)
    except FileNotFoundError:
        print(f"File {zip_path} tidak ditemukan.")

def fitur_atb(notes):
    histogram, _ = np.histogram(notes, bins=128, range=(0, 127))
    total_count = np.sum(histogram)
    norm_histogram = histogram / total_count 
    return norm_histogram

def fitur_rtb(notes):
    intervals = np.diff(notes)
    histogram, _ = np.histogram(intervals, bins=255, range=(-127, 127))
    total_count = np.sum(histogram)
    norm_histogram = histogram / total_count
    return norm_histogram

def fitur_ftb(notes):
    first_note = notes[0]
    intervals = np.array(notes) - first_note
    histogram, _ = np.histogram(intervals, bins=255, range=(-127, 127))
    total_count = np.sum(histogram)
    norm_histogram = histogram / total_count
    return norm_histogram

def cosine_similarity(vec1, vec2):
    dot_product = np.dot(vec1, vec2)
    magnitude_vec1 = np.linalg.norm(vec1)
    magnitude_vec2 = np.linalg.norm(vec2)
    if magnitude_vec1 == 0 or magnitude_vec2 == 0:
        return 0
    return dot_product / (magnitude_vec1 * magnitude_vec2)

def compare_filemidi(file1, file2):
    # Proses file MIDI pertama
    fileMidi1 = process_midi_file(file1)
    notes1 = [note for segment in fileMidi1 for note, _ in segment]

    # Proses file MIDI kedua
    fileMidi2 = process_midi_file(file2)
    notes2 = [note for segment in fileMidi2 for note, _ in segment]

    # Distribusi tone dengan fitur ATB, RTB, dan FTB untuk file pertama
    file1_atb = fitur_atb(notes1)
    file1_rtb = fitur_rtb(notes1)
    file1_ftb = fitur_ftb(notes1)

    # Distribusi tone dengan fitur ATB, RTB, dan FTB untuk file kedua
    file2_atb = fitur_atb(notes2)
    file2_rtb = fitur_rtb(notes2)
    file2_ftb = fitur_ftb(notes2)

    # Hitung cosine similarity untuk masing-masing fitur
    atb = cosine_similarity(file1_atb, file2_atb)
    rtb = cosine_similarity(file1_rtb, file2_rtb)
    ftb = cosine_similarity(file1_ftb, file2_ftb)

    # Rata-rata cosine similarity
    avg_similarity = (atb + rtb + ftb) / 3
    percentage = int(avg_similarity * 100)

    return percentage
