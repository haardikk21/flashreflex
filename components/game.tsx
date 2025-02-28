import { GameBoard } from "./game-board";
import { GameRules } from "./game-rules";

export function Game() {
  return (
    <div className="w-full max-w-7xl m-4 p-4 rounded-md border flex flex-col items-center gap-8">
      <GameRules />
      <GameBoard />
    </div>
  );
}
