import logo from "../assets/e.svg"
import Image from "next/image";
export default function Home() {
  return (
    <div className=" bg-background flex justify-center items-center max-w-lg mx-auto border-2 h-screen">
      <Image src={logo}
        width={65}
        height={13}
        alt="Picture of the author"
      />
    </div>
  );
}
