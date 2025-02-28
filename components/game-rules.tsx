export function GameRules() {
  return (
    <div className="flex flex-col gap-2 max-w-prose">
      <h4 className="text-xl font-medium text-center">Rules</h4>
      <p>
        The game is simple. First, you do a transaction, then you play a mini
        reaction game.
      </p>
      <p>
        For the reaction game, there are a few random Base logos on your screen.
        As soon as you broadcast your transaction, you need to click the one
        that turns into the Flashbots logo as quick as you can.
      </p>
      <p>
        If you react before a preconfirmation comes through, you 100% win the
        game!
      </p>
      <p>
        If you react after a preconfirmation comes through, but before a regular
        preconfirmation, not bad - but you can do better.
      </p>
      <p>
        If you react after both types of confirmations come through, TOO SLOW!
      </p>
    </div>
  );
}
