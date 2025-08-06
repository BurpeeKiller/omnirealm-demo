from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

# CORS le plus permissif possible pour le test
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Test server running"}

@app.post("/test-upload")
async def test_upload(file: UploadFile = File(...)):
    content = await file.read()
    return {
        "filename": file.filename,
        "size": len(content),
        "status": "OK"
    }

if __name__ == "__main__":
    print("Starting test server on http://0.0.0.0:8001")
    uvicorn.run(app, host="0.0.0.0", port=8001)