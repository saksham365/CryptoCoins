import "./globals.css";
import Navbar from "../components/Navbar/Navbar";
import CoinContextProvider from "../context/CoinContext";
import ThemeContextProvider from "../context/ThemeContext";
import "remixicon/fonts/remixicon.css"; // Ensure this is installed or migrated

export const metadata = {
  title: "CryptoCoins",
  description: "Track your crypto coins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
               (function() {
                 try {
                   var localTheme = localStorage.getItem('theme');
                   var theme = localTheme || 'dark';
                   document.documentElement.setAttribute('data-theme', theme);
                 } catch (e) {}
               })();
             `
          }}
        />
      </head>
      <body>
        <ThemeContextProvider>
          <CoinContextProvider>
            <Navbar />
            {children}
          </CoinContextProvider>
        </ThemeContextProvider>
      </body>
    </html>
  );
}
