import clsx from "clsx";
import { twMerge } from "tailwind-merge";

/**
 *
 * @param  {...import("clsx").ClassValue} cn
 * @returns
 */
export const cnm = (...cn: import("clsx").ClassValue[]) => twMerge(clsx(cn));
