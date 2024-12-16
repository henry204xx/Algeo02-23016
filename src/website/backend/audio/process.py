import os
import mido
import numpy as np

def read_midi(file_path):
    midi = mido.MidiFile(file_path)
    notes = []
    for i, track in enumerate(midi.tracks):
        for msg in track:
            if msg.type == 'note_on' and msg.channel == 0:  
                notes.append((msg.note, msg.time))
    return notes

def find_fileMidi_inZip(zip_folder, selected_folder, midi_file_name):
    folder_path = os.path.join(zip_folder, selected_folder)
    if os.path.isdir(folder_path):
        for root, dirs, files in os.walk(folder_path):
            for file in files:
                if file.lower() == midi_file_name.lower(): 
                    file_path = os.path.join(root, file)
                    return file_path
    return None

def windowing(notes, min_window_size=20, max_window_size=40, step_size=4):
    windowed_segments = []
    for window_size in range(min_window_size, max_window_size + 1):
        for i in range(0, len(notes) - window_size + 1, step_size):
            windowed_segments.append(notes[i:i + window_size])
    return windowed_segments

def normalisasi_tempo(segments):
    normalized_segments = []
    for segment in segments:
        notes, times = zip(*segment)
        mean_pitch = np.mean(notes)
        std_pitch = np.std(notes)
        
        if std_pitch == 0:
            norm_notes = [0 for note in notes] 
        else:
            norm_notes = [int(round((note - mean_pitch) / std_pitch)) for note in notes]  
        
        norm_times = [int(round(float(time) * 100)) for time in np.cumsum(times) / np.sum(times)]  
        normalized_segments.append(list(zip(norm_notes, norm_times)))
    return normalized_segments

def representasi_numerik(segments):
    numeric_segments = []
    for segment in segments:
        notes, times = zip(*segment)
        duration = np.diff(times, prepend=0) 
        representation = list(zip(map(int, notes), map(int, duration))) 
        numeric_segments.append(representation)
    return numeric_segments

def process_midi_file(file_path):
    notes = read_midi(file_path)
    segments = windowing(notes)
    normalized_segments = normalisasi_tempo(segments)
    numeric_segments = representasi_numerik(normalized_segments)
    return numeric_segments