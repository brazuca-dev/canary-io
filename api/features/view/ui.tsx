import { Layout } from "../layout.tsx";

interface ViewAssetUploadedPageProps {
  assetUrl: string;
  type: string;
}

const CDN_FILE_ELEMENT_JS = `${Deno.env.get("CONTENT_DELIVERY_URL")}/content/file-element.js` || "";

export const ViewAssetUploadedPage = (
  { assetUrl, type }: ViewAssetUploadedPageProps,
) => (
  <Layout title="View Uploaded Asset">
    <div>
      <h3>Asset Uploaded</h3>
      <hr />
      <p>
        View uploaded asset access: <a href={assetUrl}>here</a>
      </p>
      
      <file-element src={assetUrl} type={type} alt="Uploaded Asset" />
      <script defer src={CDN_FILE_ELEMENT_JS} type="module"></script>
    </div>
  </Layout>
);