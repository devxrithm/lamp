import Image from "next/image";
import QRScanner from "./scanner/Qrscanner";

export default function Home() {
  return (
    <>
      <div className="flex justify-center  items-center gap-4 bg-black p-3">
        <Image
          src="/IIMT-LOGO.png"
          alt="IIMT Logo"
          width={250}
          height={250}
          className="object-contain bg-black"
        />

        <div className="flex items-center gap-1 px-1 lg:px-3">
          <span className="text-white text-4xl font-light tracking-widest">×</span>
        </div>

        {/* <div className="relative w-[100px] h-[40px]"> */}
        <Image
          src="/mih.png"
          alt="MIH Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>
      <QRScanner />
    </>
  );
}
