query_image_folder = "src/website/uploads/queryImage"
query_image_files = [f for f in os.listdir(query_image_folder) if f.endswith(('.jpg', '.jpeg', '.png'))]

if not query_image_files:
    print(f"No image files found in query image folder: {query_image_folder}")
    exit(1)

# Assuming we take the first image file found in the query image folder
query_image_path = os.path.join(query_image_folder, query_image_files[0])