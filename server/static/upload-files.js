document
    .querySelector("#upload-file-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const photo = formData.get("photo");

        const responseOfUploadRequest = await fetch("/upload", {
            method: "post",
            body: JSON.stringify({
                file: {
                    type: photo.type,
                    name: photo.name,
                    lastModified: photo.lastModified,
                },
            }),
        });

        const { preSignedUrl, key } = await responseOfUploadRequest.json();

        const responseOfPresignedUrl = await fetch(preSignedUrl, {
            body: photo,
            method: "PUT",
            headers: { "Content-Length": photo.size },
        });

        if (!responseOfPresignedUrl.ok) {
            throw new Error(
                "Failed to upload file:" + responseOfPresignedUrl.status,
            );
        }
        globalThis.location.href = "/view/" + key;
    });
