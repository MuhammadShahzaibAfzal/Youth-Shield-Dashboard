/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import type { IHeightOption } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getExpiryTime = () => {
  const TOKEN_EXPIRY_TIME = Date.now() + 60 * 60 * 1000;
  return TOKEN_EXPIRY_TIME;
};

export function getErrorMessage(error: any) {
  const message = error?.response?.data?.errors?.[0]?.msg || "Something went wrong.";
  const type = error?.response?.data?.errors?.[0]?.type || "Server Error";
  const ref = error?.response?.data?.errors?.[0]?.ref || "N/A";
  return {
    message,
    type,
    ref,
  };
}

export const formatTimestamp = (date: Date) => {
  console.log(date);
  return format(date, "PPP");
};

export const config = {
  uploader: {
    insertImageAsBase64URI: false,
    imagesExtensions: ["jpg", "png", "jpeg", "gif"],
    withCredentials: false,
    format: "json",
    method: "POST",
    url: `${import.meta.env.VITE_BACKEND_API_URL}/news/upload`,

    prepareData: function (data: FormData) {
      // @ts-ignore
      if (this.file) {
        // @ts-ignore
        data.append("image", this.file); // Use the correct field name (`image`)
      }
      return data;
    },
    isSuccess: function (resp: any) {
      return !resp.error;
    },
    getMsg: function (resp: any) {
      return resp.msg?.join !== undefined ? resp.msg.join(" ") : resp.msg;
    },
    process: function (resp: any) {
      console.log(resp);
      return {
        files: [resp?.url],
        path: "",
        baseurl: "",
        error: resp.error ? 1 : 0,
        msg: resp.msg,
      };
    },
    // @ts-ignore
    defaultHandlerSuccess: function (data: any) {
      const files = data.files || [];
      // @ts-ignore
      if (files.length && this.selection) {
        // @ts-ignore
        this.selection.insertImage(files[0], null, 250);
      }
    },
    defaultHandlerError: function (resp: any) {
      // @ts-ignore
      this.events.fire("errorPopap", this.i18n(resp.msg));
    },
  },
  controls: {
    paragraph: {
      list: {
        p: "Pharagraph",
        h1: "Heading 1",
        h2: "Heading 2",
        h3: "Heading 3",
        h4: "Heading 4",
        h5: "Heading 5",
        h6: "Heading 6",
      },
    },
  },
  askBeforePasteFromWord: false,
  askBeforePasteHTML: false,
  placeholder: "",
  style: {
    background: "var(--color-secondary)",
    color: "var(--color-foreground)",
    fontSize: "16px",
    fontFamily: "sans-serif",
    placeholder: "var(--color-muted-foreground)",
    placeholderOpacity: "0.5",
  },
};

export function convertTo12HourFormat(time24: string): string {
  const [hourStr, minute] = time24.split(":");
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? "PM" : "AM";

  hour = hour % 12 || 12;

  return `${hour}:${minute} ${ampm}`;
}

export const defaultHeightOptions: IHeightOption[] = [
  {
    height: "4'10\"",
    weights: [
      { weight: "Less than 119", score: 0 },
      { weight: "119-142", score: 1 },
      { weight: "143-190", score: 2 },
      { weight: "191+", score: 3 },
    ],
  },
  {
    height: "4'11\"",
    weights: [
      { weight: "Less than 124", score: 0 },
      { weight: "124-147", score: 1 },
      { weight: "148-197", score: 2 },
      { weight: "198+", score: 3 },
    ],
  },
  {
    height: "5'0\"",
    weights: [
      { weight: "Less than 128", score: 0 },
      { weight: "128-152", score: 1 },
      { weight: "153-203", score: 2 },
      { weight: "204+", score: 3 },
    ],
  },
  {
    height: "5'1\"",
    weights: [
      { weight: "Less than 132", score: 0 },
      { weight: "132-157", score: 1 },
      { weight: "158-210", score: 2 },
      { weight: "211+", score: 3 },
    ],
  },
  {
    height: "5'2\"",
    weights: [
      { weight: "Less than 136", score: 0 },
      { weight: "136-163", score: 1 },
      { weight: "164-217", score: 2 },
      { weight: "218+", score: 3 },
    ],
  },
  {
    height: "5'3\"",
    weights: [
      { weight: "Less than 141", score: 0 },
      { weight: "141-168", score: 1 },
      { weight: "169-224", score: 2 },
      { weight: "225+", score: 3 },
    ],
  },
  {
    height: "5'4\"",
    weights: [
      { weight: "Less than 145", score: 0 },
      { weight: "145-173", score: 1 },
      { weight: "174-231", score: 2 },
      { weight: "232+", score: 3 },
    ],
  },
  {
    height: "5'5\"",
    weights: [
      { weight: "Less than 150", score: 0 },
      { weight: "150-179", score: 1 },
      { weight: "180-239", score: 2 },
      { weight: "240+", score: 3 },
    ],
  },
  {
    height: "5'6\"",
    weights: [
      { weight: "Less than 155", score: 0 },
      { weight: "155-185", score: 1 },
      { weight: "186-246", score: 2 },
      { weight: "247+", score: 3 },
    ],
  },
  {
    height: "5'7\"",
    weights: [
      { weight: "Less than 159", score: 0 },
      { weight: "159-190", score: 1 },
      { weight: "191-254", score: 2 },
      { weight: "255+", score: 3 },
    ],
  },
  {
    height: "5'8\"",
    weights: [
      { weight: "Less than 164", score: 0 },
      { weight: "164-196", score: 1 },
      { weight: "197-261", score: 2 },
      { weight: "262+", score: 3 },
    ],
  },
  {
    height: "5'9\"",
    weights: [
      { weight: "Less than 169", score: 0 },
      { weight: "169-202", score: 1 },
      { weight: "203-269", score: 2 },
      { weight: "270+", score: 3 },
    ],
  },
  {
    height: "5'10\"",
    weights: [
      { weight: "Less than 174", score: 0 },
      { weight: "174-208", score: 1 },
      { weight: "209-277", score: 2 },
      { weight: "278+", score: 3 },
    ],
  },
  {
    height: "5'11\"",
    weights: [
      { weight: "Less than 179", score: 0 },
      { weight: "179-214", score: 1 },
      { weight: "215-285", score: 2 },
      { weight: "286+", score: 3 },
    ],
  },
  {
    height: "6'0\"",
    weights: [
      { weight: "Less than 184", score: 0 },
      { weight: "184-220", score: 1 },
      { weight: "221-293", score: 2 },
      { weight: "294+", score: 3 },
    ],
  },
  {
    height: "6'1\"",
    weights: [
      { weight: "Less than 189", score: 0 },
      { weight: "189-226", score: 1 },
      { weight: "227-301", score: 2 },
      { weight: "302+", score: 3 },
    ],
  },
  {
    height: "6'2\"",
    weights: [
      { weight: "Less than 194", score: 0 },
      { weight: "194-232", score: 1 },
      { weight: "233-310", score: 2 },
      { weight: "311+", score: 3 },
    ],
  },
  {
    height: "6'3\"",
    weights: [
      { weight: "Less than 200", score: 0 },
      { weight: "200-239", score: 1 },
      { weight: "240-318", score: 2 },
      { weight: "319+", score: 3 },
    ],
  },
  {
    height: "6'4\"",
    weights: [
      { weight: "Less than 205", score: 0 },
      { weight: "205-245", score: 1 },
      { weight: "246-327", score: 2 },
      { weight: "328+", score: 3 },
    ],
  },
];
