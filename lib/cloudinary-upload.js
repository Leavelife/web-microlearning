import cloudinary from "./claudinary"

export async function uploadProfileImage(buffer, filename) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "web-microlearning/profiles",
        resource_type: "auto",
        public_id: filename.replace(/\.[^/.]+$/, ""),
        overwrite: true,
        format: "webp",
        quality: "auto",
        transformation: [
          {
            width: 300,
            height: 300,
            crop: "fill",
            gravity: "face",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(buffer)
  })
}

export async function uploadAdminImage(buffer, filename, folder) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `web-microlearning/admin/${folder}`,
        resource_type: "auto",
        public_id: filename.replace(/\.[^/.]+$/, ""),
        overwrite: true,
        format: "webp",
        quality: "auto",
        transformation: [
          {
            crop: "fit",
          },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error)
        } else {
          resolve(result)
        }
      }
    )

    uploadStream.end(buffer)
  })
}

export async function deleteProfileImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error)
  }
}

export async function deleteAdminImage(publicId) {
  try {
    await cloudinary.uploader.destroy(publicId)
  } catch (error) {
    console.error("Failed to delete image from Cloudinary:", error)
  }
}
