from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import zipfile

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create upload directories if they don't exist
os.makedirs("uploads/audios", exist_ok=True)
os.makedirs("uploads/pictures", exist_ok=True)
os.makedirs("uploads/mapper", exist_ok=True)

@app.post("/upload/{file_type}")
async def upload_file(file_type: str, file: UploadFile = File(...)):
    upload_dir = f"uploads/{file_type}"
    file_path = f"{upload_dir}/{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # If the file is a zip file, unzip it
    if file.filename.endswith(".zip"):
        with zipfile.ZipFile(file_path, 'r') as zip_ref:
            zip_ref.extractall(upload_dir)
        os.remove(file_path)  # Remove the zip file after extraction
    
    return {"filename": file.filename, "file_type": file_type}

@app.get("/files/{file_type}")
async def list_files(file_type: str):
    directory = f"uploads/{file_type}"
    files = os.listdir(directory)
    file_urls = [f"/uploads/{file_type}/{file}" for file in files]
    return {"files": file_urls}