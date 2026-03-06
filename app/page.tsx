import { MatrixBackground } from "@/components/MatrixBackground";
import { LoginCard } from "@/components/LoginCard";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center bg-black overflow-hidden selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Background Matrix Effect */}
      <MatrixBackground />

      {/* Centered Login Interface */}
      <LoginCard />
    </main>
  );
}
