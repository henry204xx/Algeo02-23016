query_dir = os.path.join('src', 'website', 'uploads', 'queryMusic')
    query_files = [os.path.splitext(f)[0] for f in os.listdir(query_dir) if f.lower().endswith('.mid')]
    
    if not query_files:
        raise FileNotFoundError("Tidak ada file MIDI di dalam folder 'src/website/uploads/queryMusic'.")
    
    query = query_files[0]  # Menggunakan nama file MIDI pertama yang ditemukan