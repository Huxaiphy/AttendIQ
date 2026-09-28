import os

import requests
from fastapi import FastAPI, File, UploadFile
from dotenv import load_dotenv
from fastapi import Body 

load_dotenv(".env", override=True)

app = FastAPI()

FACEPP_API_KEY = os.getenv("FACEPP_API_KEY")
FACEPP_API_SECRET = os.getenv("FACEPP_API_SECRET")
FACEPP_FACESET_TOKEN = os.getenv("FACEPP_FACESET_TOKEN")

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
    
@app.post("/recognize-face")
 async def recognize_face(file: UploadFile = File(...)):
    image_bytes = await file.read()

    # Step 1: Detect face
    detect_response = requests.post(
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

    detect_result = detect_response.json()

    print(
        "Face++ detect result:",
        detect_result
    )

    if detect_response.status_code != 200:
        return {
            "matched": False,
            "reason": "face_detection_failed",
            "error": detect_result,
        }

    faces = detect_result.get("faces", [])

    if len(faces) == 0:
        return {
            "matched": False,
            "reason": "no_face_detected",
        }

    if len(faces) > 1:
        return {
            "matched": False,
            "reason": "multiple_faces_detected",
        }

    face_token = faces[0]["face_token"]

    print("Detected face token:", face_token)

    # Step 2: Search FaceSet
    search_response = requests.post(
        "https://api-us.faceplusplus.com/facepp/v3/search",
        data={
            "api_key": FACEPP_API_KEY,
            "api_secret": FACEPP_API_SECRET,
            "face_token": face_token,
            "faceset_token": FACEPP_FACESET_TOKEN,
        },
    )

    search_result = search_response.json()

    print(
        "Face++ search result:",
        search_result
    )

    if search_response.status_code != 200:
        return {
            "matched": False,
            "reason": "face_search_failed",
            "error": search_result,
        }

    results = search_result.get("results", [])

    if not results:
        return {
            "matched": False,
            "reason": "no_match_found",
            "search_result": search_result,
        }

    best_match = results[0]

    confidence = best_match.get("confidence", 0)
    matched_face_token = best_match.get("face_token")

    if confidence < 80:
        return {
            "matched": False,
            "reason": "low_confidence",
            "confidence": confidence,
            "matched_face_token": matched_face_token,
        }

    return {
        "matched": True,
        "matched_face_token": matched_face_token,
        "confidence": confidence,
    }
    
#@app.post("/recognize-face")
a#sync def recognize_face(file: UploadFile = File(...)):
  #  image_bytes = await file.read()

   # detect_response = requests.post(
    #    "https://api-us.faceplusplus.com/facepp/v3/detect",
     #   data={
      #      "api_key": FACEPP_API_KEY,
       #     "api_secret": FACEPP_API_SECRET,
        #},
        #files={
        #    "image_file": (file.filename, image_bytes, file.content_type)
        #},
    #)
    #detect_result = detect_response.json()
    #faces = detect_result.get("faces", [])

    #if not faces:
     #   return {"matched": False, "reason": "no_face_detected"}

    #face_token = faces[0]["face_token"]

    #search_response = requests.post(
     #   "https://api-us.faceplusplus.com/facepp/v3/search",
      #  data={
       #     "api_key": FACEPP_API_KEY,
        #    "api_secret": FACEPP_API_SECRET,
         #   "face_token": face_token,
          #  "faceset_token": FACEPP_FACESET_TOKEN,
       # },
    #)
    #search_result = search_response.json()
    #results = search_result.get("results", [])
    
    #print("Face++ search result:", search_result)

    #if not results:
     #   return {
      #      "matched": False,
       #     "reason": "no_match_found",
        #    "search_result":
         #       search_result,
        #}
        
  #  confidence = results[0]
   # ["confidence"]
    
    #if confidence < 80:
     #   return {
      #      "matched": False,
       #     "reason": "low_confidence",
        #    "confidence": confidence,
        #}
        #return {
         #   "matched": True,
          #  "matched_face_token":
           #     results[0]["face_token"],
            #    "confidence": results[0]
             #   ["confidence"],
        #}
        
@app.get("/faceset-info")
def faceset_info():
    response = requests.post(
        "https://api-us.faceplusplus.com/facepp/v3/faceset/getdetail",
        data={
            "api_key": FACEPP_API_KEY,
            "api_secret": FACEPP_API_SECRET,
            "faceset_token": FACEPP_FACESET_TOKEN,
        },
    )

    return {
        "status_code": response.status_code,
        "response": response.json(),
    }
    
@app.post("/test-add-face-to-faceset")
def test_add_face_to_faceset(
    face_token: str = Body(..., embed=True),
    faceset_token: str = Body(..., embed=True),
):
    response = requests.post(
        "https://api-us.faceplusplus.com/facepp/v3/faceset/addface",
        data={
            "api_key": FACEPP_API_KEY,
            "api_secret": FACEPP_API_SECRET,
            "faceset_token": faceset_token,
            "face_tokens": face_token,
        },
    )

    return {
        "status_code": response.status_code,
        "response": response.json(),
    }