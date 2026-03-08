import type { FC } from "hono/jsx";
import { HtmlEscapedString } from "hono/utils/html";

interface LayoutProps {
  title?: string;
  children: HtmlEscapedString | Promise<HtmlEscapedString> | null;
}

export const Layout: FC<LayoutProps> = ({ title, children }: LayoutProps) => (
  <html lang="en">
    <head>
      <title>{`Canary | ${title || ""}`}</title>
    </head>

    <body>
      {children || "Hello World!"}
    </body>
  </html>
);