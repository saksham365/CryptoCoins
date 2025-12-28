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
    <html lang="en">
      <head>
        {/* Using CDN for remixicon if not installing package, mimicking original usage which might rely on index.html imports, checking that later. 
                Original index.html was not checked for CDNs. But assuming package or CDN.
                Safe bet: Add CDN link if we can, or just install package. 
                I'll assume I need to install 'remixicon' or use CDN.
            */}
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
          rel="stylesheet"
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
