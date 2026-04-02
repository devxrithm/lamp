import Image from "next/image";
import { Users, Upload, ArrowRight, Scan } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050a0e] text-white overflow-hidden relative">

      {/* Ambient background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-[#00ffee08] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-[#00ff8808] blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #00ffee 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header / Nav */}
      <header className="relative z-10 flex items-center justify-between px-8 lg:px-16 py-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-6">
          <div className="relative">
            <Image
              src="/IIMT-LOGO.png"
              alt="IIMT Logo"
              width={180}
              height={60}
              className="object-contain brightness-110"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-px h-8 bg-white/20" />
            <span className="text-white/30 text-xl font-thin tracking-[0.3em]">×</span>
            <div className="w-px h-8 bg-white/20" />
          </div>

          <Image
            src="/mih.png"
            alt="MIH Logo"
            width={90}
            height={50}
            className="object-contain brightness-110"
          />
        </div>
      </header>

      <div className="relative z-10 px-8 lg:px-16 pt-16 pb-8">
        <h1 className="text-7xl lg:text-9xl font-bold  leading-[0.75]">
          MIND INSTALLERS HACKATHON{" "}
          <span className="relative inline-block">
            <span className="text-red-500">
              4.0
            </span>
          </span>
        </h1>
        <p className="mt-4 text-white/40 text-lg max-w-xl leading-relaxed">
          Unleash Your Innovation. Build the Future.
        </p>
      </div>

      <main className="relative z-10 px-8 lg:px-16 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
          <Link href={'/scanner'}>
            <button className="group relative text-left rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 overflow-hidden
            hover:border-[#00ffee44] hover:bg-[#00ffee06] transition-all duration-300 cursor-pointer">

              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at top right, #00ffee18, transparent 70%)",
                }} />

              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-xl bg-[#00ffee12] border border-[#00ffee22]">
                  <Scan size={24} className="text-[#00ffee]" />
                </div>
                <ArrowRight
                  size={18}
                  className="text-white/20 group-hover:text-[#00ffee] group-hover:translate-x-1 transition-all duration-300"
                />
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-[#00ffee] transition-colors duration-300">
                Verify Participants
              </h2>
              <p className="text-sm text-white/40 leading-relaxed">
                Scan QR codes and validate attendee credentials instantly.
              </p>
            </button>
          </Link>

          <Link href={'/mentor-upload'}>
            <button className="group relative text-left rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 overflow-hidden
            hover:border-[#00ff8844] hover:bg-[#00ff8806] transition-all duration-300 cursor-pointer">

              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at top right, #00ff8818, transparent 70%)",
                }} />

              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-xl bg-[#00ff8812] border border-[#00ff8822]">
                  <Upload size={24} className="text-[#00ff88]" />
                </div>
                <ArrowRight
                  size={18}
                  className="text-white/20 group-hover:text-[#00ff88] group-hover:translate-x-1 transition-all duration-300"
                />
              </div>

              <h2 className="text-xl font-semibold mb-2 group-hover:text-[#00ff88] transition-colors duration-300">
                Upload Marks For Mentor
              </h2>
              <p className="text-sm text-white/40 leading-relaxed">
                Submit and manage participant assessment data securely.
              </p>
            </button>
          </Link>
          {/* <Link href={'/upload'}>
            <button className="group relative text-left rounded-2xl border border-white/[0.08] bg-white/[0.03] p-8 overflow-hidden
            hover:border-[#00ff8844] hover:bg-[#00ff8806] transition-all duration-300 cursor-pointer">

              <div className="absolute top-0 right-0 w-24 h-24 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: "radial-gradient(circle at top right, #00ff8818, transparent 70%)",
                }} />

              <div className="flex items-start justify-between mb-6">
                <div className="p-3 rounded-xl bg-[#00ff8812] border border-[#00ff8822]">
                  <Upload size={24} className="text-[#00ff88]" />
                </div>
                <ArrowRight
                  size={18}
                  className="text-white/20 group-hover:text-[#00ff88] group-hover:translate-x-1 transition-all duration-300"
                />
              </div>

              <h2 className="text-xl font-semibold mb-2 group-hover:text-[#00ff88] transition-colors duration-300">
                Upload Marks
              </h2>
              <p className="text-sm text-white/40 leading-relaxed">
                Submit and manage participant assessment data securely.
              </p>
            </button>
          </Link> */}
        </div>
      </main>


      <footer className="relative z-10 px-8 lg:px-16 py-6 mt-8 border-t border-white/[0.04]">
        <p className="text-white/20 text-xs tracking-widest font-bold">
          IIMT × MIH — Build By Ujjwal Katiyar
        </p>
      </footer>
    </div>
  );
}