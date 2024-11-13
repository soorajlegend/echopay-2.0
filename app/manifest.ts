import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Echo Payment",
    short_name: "Echopay",
    description: "An AI financial assistant",
    start_url: "/",
    display: "standalone",
    background_color: "#003056",
    theme_color: "#ffffff",
    orientation: "portrait",
    scope: "/",
    lang: "en",
    prefer_related_applications: false,
    icons: [
      //   {
      //     src: "/icon-192x192.png",
      //     sizes: "192x192",
      //     type: "image/png",
      //     purpose: "maskable",
      //   },
      //   {
      //     src: "/icon-384x384.png",
      //     sizes: "384x384",
      //     type: "image/png",
      //   },
      //   {
      //     src: "/icon-512x512.png",
      //     sizes: "512x512",
      //     type: "image/png",
      //   },
    ],
    screenshots: [
      //   {
      //     src: "/learnoch-auth1.webp",
      //     type: "image/webp",
      //     sizes: "1280x720",
      //   },
      //   {
      //     src: "/learnoch-auth2.webp",
      //     type: "image/webp",
      //     sizes: "1280x720",
      //   },
    ],
    categories: ["Finance", "AI"],
    shortcuts: [
      {
        name: "Start Transactions",
        url: "/",
        description: "Finance made easy",
      },
    ],
  };
}
