import { Layout } from "../layout.tsx";

interface ViewAssetUploadedPageProps {
  assetUrl: string;
  type: string;
}

const CDN_FILE_ELEMENT_JS =
  `${Deno.env.get("CDN_BASE_URL")}/static/file-element.js` || "";

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
      <script defer type="module" src={CDN_FILE_ELEMENT_JS}></script>
    </div>
  </Layout>
);
