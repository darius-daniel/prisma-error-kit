const Exposure = {
  SAFE: "SAFE",
  SANITIZED: "SANITIZED",
  INTERNAL: "INTERNAL",
} as const;

export type ExposureType = (typeof Exposure)[keyof typeof Exposure];

export default Exposure;
