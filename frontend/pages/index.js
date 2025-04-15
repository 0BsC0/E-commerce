import { Geist, Geist_Mono } from "next/font/google";
import UserList from "../components/UserList";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function Home() {
  return (
    <div className={`${geistSans.className} ${geistMono.className} bg-gray-50 min-h-screen p-8`}>
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
        E-commerce Viveros – Usuarios Registrados
      </h1>
      <UserList />
    </div>
  );
}
