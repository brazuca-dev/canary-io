document
    .querySelector("#upload-file-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const photo = formData.get("photo");

        const responseOfUploadRequest = await fetch("/upload", {
            method: "post",
            body: JSON.stringify({
                fileMetaData: {
                    type: photo.type.split('/')[1],
                    name: photo.name,
                    lastModified: photo.lastModified,
                },
            }),
        });

        const { preSignedUrl, key } = await responseOfUploadRequest.json();

        const responseOfPresignedUrl = await fetch(preSignedUrl, {
            body: photo,
            method: "put",
            headers: { "Content-Length": photo.size },
        });

        if (!responseOfPresignedUrl.ok) {
            throw new Error(
                "Failed to upload file:" + responseOfPresignedUrl.status,
            );
        }
        globalThis.location.href = "/view/" + key;
    });