declare module "flubber" {
  type InterpolateOptions = {
    maxSegmentLength?: number
    string?: boolean
  }

  export function interpolate(
    fromShape: string,
    toShape: string,
    options?: InterpolateOptions,
  ): (t: number) => string
}
