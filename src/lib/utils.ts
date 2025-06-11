/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

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
