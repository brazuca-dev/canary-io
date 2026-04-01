import { Layout } from "../layout.tsx";

const CDN_UPLOAD_FILES_JAVASCRIPT =
  `${Deno.env.get("CONTENT_DELIVERY_URL")}/static/upload-files.js` || "";

export const UploadPage = () => (
  <Layout title="Upload Asset">
    <form id="upload-file-form">
      <fieldset>
        <legend>Upload de imagens</legend>
        <input
          required
          name="photo"
          type="file"
          accept="image/*"
          placeholder="Escolha uma imagem"
        />
        <br />
        <br />
        <button type="submit">Submit</button>
      </fieldset>
      <script defer src={CDN_UPLOAD_FILES_JAVASCRIPT}></script>
    </form>
  </Layout>
);

