export async function uploadFile(fileType: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
  
    const response = await fetch(`http://localhost:8000/upload/${fileType}`, {
      method: 'POST',
      body: formData,
    })
  
    if (!response.ok) {
      throw new Error('Upload failed')
    }
  
    
    return response.json()
  }