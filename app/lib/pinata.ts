import { PinataSDK } from "pinata";

const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT,
  pinataGateway: process.env.PINATA_GATEWAY,
});

export async function uploadImage(
  image: string
): Promise<{ cid: string; url: string }> {
  const file = stringBase64ToFile(image, "image.png", "image/png");
  const upload = await pinata.upload.public.file(file);

  return {
    cid: upload.cid,
    url: `https://${process.env.PINATA_GATEWAY}/ipfs/${upload.cid}`,
  };
}

function stringBase64ToFile(
  stringBase64: string,
  filename: string,
  type: string
): File {
  // Extract the base64 data from the string
  const base64Data = stringBase64.split(",")[1];

  // Convert base64 to binary
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create file object
  return new File([byteArray], filename, { type });
}
