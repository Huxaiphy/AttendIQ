import os

import requests
from fastapi import FastAPI, File, UploadFile
from dotenv import load_dotenv
from fastapi import Body 

load_dotenv(".env", override=True)

app = FastAPI()

FACEPP_API_KEY = os.getenv("FACEPP_API_KEY")
FACEPP_API_SECRET = os.getenv("FACEPP_API_SECRET")


@app.get("/")
def home():
    return {
        "message": "AttendIQ backend is working",
        "facepp_configured": bool(
            FACEPP_API_KEY and FACEPP_API_SECRET
        )
    }


@app.get("/test-facepp")
def test_facepp():
    response = requests.post(
        "https://api-us.faceplusplus.com/facepp/v3/detect",
        data={
            "api_key": FACEPP_API_KEY,
            "api_secret": FACEPP_API_SECRET,
        },
    )

    return {
        "status_code": response.status_code,
        "response": response.json(),
    }


@app.post("/create-faceset")
def create_faceset():
    response = requests.post(
        "https://api-us.faceplusplus.com/facepp/v3/faceset/create",
        data={
            "api_key": FACEPP_API_KEY,
            "api_secret": FACEPP_API_SECRET,
            "display_name": "AttendIQ Students",
        },
    )

    return {
        "status_code": response.status_code,
        "response": response.json(),
    }
    
@app.post("/detect-face")
async def detect_face(file: UploadFile = File(...)):
    image_bytes = await file.read()

    response = requests.post(
        "https://api-us.faceplusplus.com/facepp/v3/detect",
        data={
            "api_key": FACEPP_API_KEY,
            "api_secret": FACEPP_API_SECRET,
        },
        files={
            "image_file": (
                file.filename,
                image_bytes,
                file.content_type,
            )
        },
    )

    return {
        "status_code": response.status_code,
        "response": response.json(),
    }
    
@app.post("/add-face-to-faceset")
def add_face_to_faceset(face_token: str = Body (..., embed=True)):
    response = requests.post(
        "https://api-us.faceplusplus.com/facepp/v3/faceset/addface",
        data={
            "api_key": FACEPP_API_KEY,
            "api_secret": FACEPP_API_SECRET,
            "faceset_token": FACEPP_FACESET_TOKEN,
            "face_tokens": face_token,
        },
    )

    return {
        "status_code": response.status_code,
        "response": response.json(),
    }