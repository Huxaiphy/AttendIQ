import * as FileSystem from "expo-file-system/legacy";

const BACKEND_URL = "http://192.168.193.135:8000";

export const enrollPerson = async (imageUri) => {
  try {
    console.log("Face++: detecting face...");

    const formData = new FormData();

    formData.append("file", {
      uri: imageUri,
      name: "student.jpg",
      type: "image/jpeg",
    });

    const detectResponse = await fetch(
      `${BACKEND_URL}/detect-face`,
      {
        method: "POST",
        body: formData,
      }
    );

    const detectResult = await detectResponse.json();

    console.log("Face++ detect response:", detectResult);

    if (!detectResponse.ok) {
      throw new Error("Face detection request failed.");
    }

    const faces = detectResult.response?.faces;

    if (!faces || faces.length === 0) {
      throw new Error("No face detected in the photo.");
    }

    const faceToken = faces[0].face_token;

    console.log("Face token received.");

    const addResponse = await fetch(
      `${BACKEND_URL}/add-face-to-faceset`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          face_token: faceToken,
        }),
      }
    );

    const addResult = await addResponse.json();

    console.log("FaceSet response:", addResult);

    if (!addResponse.ok) {
      throw new Error("Failed to add face to FaceSet.");
    }

    if (
      addResult.response?.error_message
    ) {
      throw new Error(
        addResult.response.error_message
      );
    }

    return {
      success: true,
      faceToken,
      faceSetResponse: addResult,
    };

  } catch (error) {
    console.log("Face++ enrollment error:", error);
    throw error;
  }
};