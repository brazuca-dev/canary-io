document
    .querySelector("#upload-file-form")
    .addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const photo = formData.get("photo");
        const type = photo.type.split('/')[1];

        const responseOfUploadRequest = await fetch("/upload", {
            method: "post",
            body: JSON.stringify({
                fileMetaData: {
                    type,
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
      
        const hash = key.split('/').pop().split('.')[0]
        globalThis.location.href = `/view/${hash}?file=signed&type=webp`;
    });