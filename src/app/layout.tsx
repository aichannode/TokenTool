'use client';
import type { Metadata } from "next";
// import { Inter } from "next/font/google";
import "./globals.css";
import { ContextProvider } from "./web3-provider.tsx";
import '@rainbow-me/rainbowkit/styles.css';
import Header from "@/components/Header.tsx";
// const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
//   title: "TokenTool",
//   description: "TokenTool is an online tool to create and deploy your own ERC20 and Solana Tokens on many different blockchains such as Ethereum, BNB Smart Chain, Solana, BASE and more!",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Primary Meta Tags --> */}
        <title>Ethereum &amp; Solana Token Tool</title>
        <link rel="icon" type="image/png" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="icon" type="image/png" href="/logo.png" sizes="32x32" />
        <link rel="shortcut icon" href="/logo.png" />

        <meta name="title" content="Ethereum &amp; Solana Token Generator | TokenTool" />
        <meta
          name="description"
          content="TokenTool is an online tool to create and deploy your own Ethereum and Solana tokens on many different blockchains such as Base, BSC, Blast, and more."
        />
        <meta name="keywords" content="Token, crypto, memecoins, ethereum, solana, base, blast, avalanche, BNB Smart Chain, Polygon, crypto token"></meta>
        <meta name="robots" content="index, follow" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />


        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tokentool.io/" />
        <meta property="og:title" content="TokenTool" />
        <meta
          property="og:description"
          content="TokenTool is an online tool to create and deploy your own ERC20 and Solana Tokens on many different blockchains such as Ethereum, BNB Smart Chain, Solana, BASE and more!"
        />
        <meta property="og:image" content="/logo.png" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="/logo.png" />
        <meta property="twitter:url" content="https://tokentool.io/" />
        <meta property="twitter:title" content="TokenTool" />
        <meta
          property="twitter:description"
          content="TokenTool is an online tool to create and deploy your own ERC20 and Solana Tokens on many different blockchains such as Ethereum, BNB Smart Chain, Solana, BASE and more!"
        />
        <meta property="twitter:image" content="/logo.png" />
      </head>
      <body className="bg-[#FBFBFB]">
        <ContextProvider>
          <Header />
          {children}
        </ContextProvider>
      </body>
    </html>
  );
}
