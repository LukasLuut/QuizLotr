// Recorta a imagem no centro (quadrado), reduz para `size` px e devolve uma data URL WebP.
// Assim a foto de perfil fica pequena (poucas dezenas de KB) antes de ir para a API.
export const AVATAR_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function resizeImageToDataUrl(file, size = 256, quality = 0.85) {
  return new Promise((resolve, reject) => {
    if (!AVATAR_TYPES.includes(file.type)) {
      reject(new Error("Escolha uma imagem PNG, JPEG ou WebP."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, (img.naturalWidth - side) / 2, (img.naturalHeight - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(url);
      let data = canvas.toDataURL("image/webp", quality);
      // navegadores sem WebP no canvas devolvem PNG; JPEG fica menor
      if (!data.startsWith("data:image/webp")) data = canvas.toDataURL("image/jpeg", quality);
      resolve(data);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Não foi possível ler esta imagem."));
    };
    img.src = url;
  });
}
