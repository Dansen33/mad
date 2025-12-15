import { createClient } from "next-sanity";
import { createImageUrlBuilder } from "@sanity/image-url";

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET;
const apiVersion = process.env.SANITY_API_VERSION || "2024-01-01";
const token = process.env.SANITY_WRITE_TOKEN || process.env.SANITY_READ_TOKEN;

if (!projectId || !dataset) {
  // Intentionally silent in production; you will just see empty responses if env hiányzik.
  console.warn("Sanity env vars hiányoznak: SANITY_PROJECT_ID vagy SANITY_DATASET");
}

export const sanityClient = createClient({
  projectId: projectId || "",
  dataset: dataset || "",
  apiVersion,
  useCdn: !token, // public datasetnél CDN oké
  token,
});

const builder = createImageUrlBuilder(sanityClient);
export const urlFor = (source: string | Record<string, unknown>) => builder.image(source);
