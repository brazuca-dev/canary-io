import { Layout } from "./layout.tsx";

interface ViewAssetUploadedPageProps {
  assetUrl: string;
}

export const ViewAssetUploadedPage = ({ assetUrl }: ViewAssetUploadedPageProps) =>
  <Layout title="View Uploaded Asset">
    <script src="/static/file-element.js"></script>
    <div>
      <h3>Asset Uploaded</h3>
      <hr />
      <p>View uploaded asset access: <a href={assetUrl}>here</a></p>
      <file-element src={assetUrl} alt="Uploaded Asset" />
    </div>
  </Layout>
