import { useEffect } from "react";

const TRADE_FAVICON = "/favicon.png";
const BIRTHDAY_FAVICON = "/favicon-birthday.svg";

function getFaviconLink() {
  let link = document.querySelector("link[rel='icon']");

  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }

  return link;
}

export function useFavicon(isBirthday) {
  useEffect(() => {
    const link = getFaviconLink();

    if (isBirthday) {
      link.type = "image/svg+xml";
      link.href = BIRTHDAY_FAVICON;
      return;
    }

    link.type = "image/png";
    link.href = TRADE_FAVICON;
  }, [isBirthday]);
}