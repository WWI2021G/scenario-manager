import { Inter } from "next/font/google";
import "@/app/globals.css";
import SideNavbar from '@/components/sub/Sidebar';

const inter = Inter({ subsets: ["latin"] });

const drawerWidth = 240;

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (

    <html>
    <body>
      <div style={{ display: "flex" }}>
        <SideNavbar />
        <main style={{
          flexGrow: 1,
          padding: "24px",
          marginLeft: `${drawerWidth}px`,
          width: `calc(100% - ${drawerWidth}px)`
        }}>
          {children}
        </main>
      </div>
    </body>
    </html>
  );
}