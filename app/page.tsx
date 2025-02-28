import { Game } from "@/components/game";

export default function Home() {
  return (
    <div className="flex flex-col items-center gap-8 mt-24">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl p-2 text-center">
        Experience the{" "}
        <u>
          <i>fastest</i>
        </u>{" "}
        EVM
      </h1>

      <Game />
    </div>
  );
}
