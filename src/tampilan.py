import tkinter as tk
from tkinter import ttk
from tkinter import filedialog

# Initialize the main app
root = tk.Tk()
root.title("Melody Matcher")
root.geometry("900x600")
root.configure(bg="#2C2C54")  # Dark background color

# Top Navigation Bar
top_nav = tk.Frame(root, bg="#2C2C54", height=50)
top_nav.pack(side="top", fill="x")

album_btn = tk.Button(top_nav, text="Album", bg="#8E8E93", fg="white", padx=20, pady=10, bd=0)
album_btn.pack(side="left", padx=(20, 5), pady=10)

music_btn = tk.Button(top_nav, text="Music", bg="#D0D3D9", fg="black", padx=20, pady=10, bd=0)
music_btn.pack(side="left", pady=10)

# Left Panel (Upload Section)
left_panel = tk.Frame(root, bg="#EBECF0", width=250)
left_panel.pack(side="left", fill="y")

upload_title = tk.Label(left_panel, text="Upload dataset and mapper here!", bg="#EBECF0", font=("Helvetica", 12, "bold"))
upload_title.pack(pady=20)

def upload_file(label):
    file_path = filedialog.askopenfilename(title="Upload File")
    if file_path:
        label.config(text=file_path.split('/')[-1])

btn_audio_frame = tk.Frame(left_panel, bg="#EBECF0")
btn_audio_frame.pack(fill="x", padx=10, pady=5)
btn_audio = tk.Button(btn_audio_frame, text="Audios", bg="#8AA2F7", fg="white", command=lambda: upload_file(audio_label))
btn_audio.pack(side="left", fill="x", expand=True)
audio_label = tk.Label(btn_audio_frame, text="", bg="#EBECF0")
audio_label.pack(side="left", fill="x", expand=True, padx=5)

btn_pictures_frame = tk.Frame(left_panel, bg="#EBECF0")
btn_pictures_frame.pack(fill="x", padx=10, pady=5)
btn_pictures = tk.Button(btn_pictures_frame, text="Pictures", bg="#8AA2F7", fg="white", command=lambda: upload_file(pictures_label))
btn_pictures.pack(side="left", fill="x", expand=True)
pictures_label = tk.Label(btn_pictures_frame, text="", bg="#EBECF0")
pictures_label.pack(side="left", fill="x", expand=True, padx=5)

btn_mapper_frame = tk.Frame(left_panel, bg="#EBECF0")
btn_mapper_frame.pack(fill="x", padx=10, pady=5)
btn_mapper = tk.Button(btn_mapper_frame, text="Mapper", bg="#8AA2F7", fg="white", command=lambda: upload_file(mapper_label))
btn_mapper.pack(side="left", fill="x", expand=True)
mapper_label = tk.Label(btn_mapper_frame, text="", bg="#EBECF0")
mapper_label.pack(side="left", fill="x", expand=True, padx=5)

cloud_frame = tk.Frame(left_panel, bg="#8AA2F7", bd=2, relief="solid")
cloud_frame.pack(pady=10, padx=10, fill="x")

cloud_icon = tk.Label(cloud_frame, text="☁", font=("Arial", 48), bg="#8AA2F7")
cloud_icon.pack(pady=10)

upload_btn = tk.Button(left_panel, text="Upload", bg="#B3D4FF", command=lambda: upload_file(upload_label))
upload_btn.pack(pady=10)
upload_label = tk.Label(left_panel, text="", bg="#EBECF0")
upload_label.pack(pady=5)

# Right Panel (Main Content)
right_panel = tk.Frame(root, bg="#F8F9FA")
right_panel.pack(side="right", fill="both", expand=True)

# Search Bar with Search Button
search_frame = tk.Frame(right_panel, bg="#F8F9FA")
search_frame.pack(pady=10, padx=20, fill="x")

search_bar = tk.Entry(search_frame, font=("Arial", 12), width=50)
search_bar.pack(side="left", padx=5)

search_btn = tk.Button(search_frame, text="Search", font=("Arial", 12))
search_btn.pack(side="left", padx=5)

# Audio File Grid with Pagination
audio_frame = tk.Frame(right_panel, bg="#F8F9FA")
audio_frame.pack(pady=10, padx=20, fill="both", expand=True)

# Pagination Controls
pagination_frame = tk.Frame(right_panel, bg="#F8F9FA")
pagination_frame.pack(pady=10)

prev_btn = tk.Button(pagination_frame, text="Previous", command=lambda: change_page(-1))
prev_btn.pack(side="left", padx=5)

next_btn = tk.Button(pagination_frame, text="Next", command=lambda: change_page(1))
next_btn.pack(side="left", padx=5)

# Variables for pagination
current_page = 0
items_per_page = 12
total_items = 30  # Example total number of audio files

def display_page(page):
    for widget in audio_frame.winfo_children():
        widget.destroy()

    start_index = page * items_per_page
    end_index = start_index + items_per_page

    for i in range(start_index, min(end_index, total_items)):
        row = (i % items_per_page) // 4
        col = (i % items_per_page) % 4
        audio_container = tk.Frame(audio_frame, bg="#E0E0E0", width=150, height=100)
        audio_container.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")
        
        play_btn = tk.Label(audio_container, text="▶", bg="#0E1626", fg="white", font=("Arial", 12))
        play_btn.pack(fill="x", side="top")
        
        audio_label = tk.Label(audio_container, text=f"audio{i+1}.wav", bg="#E0E0E0")
        audio_label.pack(fill="x", pady=5)

    # Make all rows and columns in the audio frame expand
    for i in range(3):  # Adjust number of rows dynamically if needed
        audio_frame.grid_rowconfigure(i, weight=1)

    for j in range(4):  # Adjust number of columns dynamically if needed
        audio_frame.grid_columnconfigure(j, weight=1)

def change_page(delta):
    global current_page
    new_page = current_page + delta
    if 0 <= new_page <= (total_items - 1) // items_per_page:
        current_page = new_page
        display_page(current_page)

# Initial display
display_page(current_page)

root.mainloop()
