import { createThirdwebClient } from "thirdweb";
import { upload, resolveScheme } from "thirdweb/storage";

const clientId =
  process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID ??
  "a543187fb1e825c2b92e9aaad47323d7";

export const thirdwebClient = createThirdwebClient({ clientId });

/** Upload files to IPFS and resolve to HTTPS gateway URLs (replaces legacy useStorageUpload + uploadWithGatewayUrl). */
export async function uploadFilesToGateway(files: File[]): Promise<string[]> {
  const uris = await upload({
    client: thirdwebClient,
    files,
  });
  const list = (Array.isArray(uris) ? uris : [uris]) as string[];
  const resolved = await Promise.all(
    list.map(async (uri) => {
      if (uri.startsWith("ipfs://")) {
        return resolveScheme({ client: thirdwebClient, uri });
      }
      return uri;
    })
  );
  return resolved;
}
