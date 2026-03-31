import { Layout } from "../layout.tsx";

interface ViewAssetUploadedPageProps {
  assetUrl: string;
  type: string;
}

export const ViewAssetUploadedPage = (
  { assetUrl, type }: ViewAssetUploadedPageProps,
) => (
  <Layout title="View Uploaded Asset">
    <script src="/content/file-element.js" type="module"></script>
    <div>
      <h3>Asset Uploaded</h3>
      <hr />
      <p>
        View uploaded asset access: <a href={assetUrl}>here</a>
      </p>
      <file-element src={assetUrl} type={type} alt="Uploaded Asset" />
    </div>
  </Layout>
);