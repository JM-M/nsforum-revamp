import { Toaster } from "@/shared/components/ui/toaster";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import NavBar from "./_components/NavBar";
import Sidebar from "./_components/Sidebar";
import { AppContextProvider } from "./_providers";
import "./_styles/globals.css";
import "./_styles/tiptap.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppContextProvider>
          <TooltipProvider>
            <NavBar />
            <div className="flex">
              <Toaster />
              <Sidebar />
              <main className="flex h-full min-h-[calc(100vh_-_80px)] flex-1 flex-col">
                {children}
              </main>
            </div>
          </TooltipProvider>
        </AppContextProvider>
      </body>
    </html>
  );
};

export default RootLayout;
