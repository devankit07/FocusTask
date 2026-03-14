import "./globals.css";

export const metadata = {
  title: "FocusTask",
  description: "Simple personal to-do list app for focused daily planning.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
