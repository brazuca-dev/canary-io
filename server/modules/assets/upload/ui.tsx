import { Layout } from "../layout.tsx";

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
      <script defer src="/static/upload-files.js"></script>
    </form>
  </Layout>
);
