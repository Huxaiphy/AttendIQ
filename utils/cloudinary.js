const CLOUD_NAME = "mqwsia9g";
const UPLOAD_PRESET = "attendiq_students";

export const uploadImageToCloudinary = async (imageUri) => {
    try {
        const data = new FormData();

        data.append("file", {
            uri: imageUri,
            type: "image/jpeg",
            name: "student.jpg",
        });

        data.append("upload_preset", UPLOAD_PRESET);

        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            {
                method: "POST",
                body: data,
            }
        );

        const result = await response.json();

        // console.log("Cloudinary response:", result);

        if (!response.ok) {
            throw new Error(
                result.error?.message || "Cloudinary upload failed"
            );
        }

        return result.secure_url;

    } catch (error) {
        console.log("Cloudinary upload error:", error);
        throw error;
    }
};