import { Layout } from "./layout.tsx";

interface ViewAssetUploadedPageProps {
  assetUrl: string;
}

export const ViewAssetUploadedPage = ({ assetUrl }: ViewAssetUploadedPageProps) =>
  <Layout title="View Uploaded Asset">
    <div>
      <h3>Asset Uploaded</h3>
      <hr />
      <p>View uploaded asset access: <a href={assetUrl}>here</a></p>
      <img alt="Asset uploaded" height="400px" src={assetUrl} />
    </div>
  </Layout>
