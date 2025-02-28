"use client";

import { CheckCircle, ExternalLinkIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createPublicClient, http } from "viem";
import { baseSepolia } from "viem/chains";
import { useSendTransaction } from "wagmi";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";

const CIRCLES = [
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "15%",
    left: "25%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "42%",
    left: "78%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "67%",
    left: "12%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "23%",
    left: "62%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "85%",
    left: "45%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "55%",
    left: "33%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "8%",
    left: "80%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "75%",
    left: "70%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "35%",
    left: "5%",
  },
  {
    src: "https://avatars.githubusercontent.com/u/108554348?v=4",
    top: "50%",
    left: "50%",
  },
];

export function GameBoard() {
  const [circles, setCircles] = useState(CIRCLES);
  const [txHash, setTxHash] = useState<string>("");
  const [flipTime, setFlipTime] = useState<number>(0);
  const [txnBroadcastTime, setTxnBroadcastTime] = useState<number>(0);
  const [regularConfirmationTime, setRegularConfirmationTime] =
    useState<number>(0);
  const [preconfirmationTime, setPreconfirmationTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number>(0);

  const { sendTransactionAsync } = useSendTransaction();

  function reset() {
    setCircles([...CIRCLES]);
    setFlipTime(0);
    setTxHash("");
    setTxnBroadcastTime(0);
    setPreconfirmationTime(0);
    setRegularConfirmationTime(0);
    setReactionTime(0);
  }

  async function initiateGame() {
    const wssUrl = "wss://sepolia.flashblocks.base.org/ws";
    const socket = new WebSocket(wssUrl);

    const baseSepoliaClient = createPublicClient({
      chain: baseSepolia,
      transport: http(),
      pollingInterval: 50,
    });

    const _txHash = await sendTransactionAsync({
      to: "0x0000000000000000000000000000000000000000",
      value: BigInt(0),
    });
    const txSendTime = Date.now();
    setTxnBroadcastTime(txSendTime);
    socket.onmessage = async (ev: MessageEvent<Blob>) => {
      const text = await ev.data.text();
      const json = JSON.parse(text);

      const receipts = json.metadata.receipts as Record<string, unknown>;
      const receipt = receipts[_txHash];
      if (receipt) {
        console.log(`PRECONF FOUND in ${Date.now() - txSendTime}ms`);
        setPreconfirmationTime(Date.now());
        socket.close();
      }
    };

    setTxHash(_txHash);
    flipRandomImage();

    await baseSepoliaClient.waitForTransactionReceipt({
      hash: _txHash,
      pollingInterval: 50,
      retryDelay: 50,
      confirmations: 0,
    });

    setRegularConfirmationTime(Date.now());
    console.log(`REGULAR CONFIRMED in ${Date.now() - txSendTime}ms`);
  }

  function flipRandomImage() {
    const newCircles = [...CIRCLES];
    const randomIndex = Math.floor(Math.random() * newCircles.length);
    newCircles[randomIndex].src =
      "https://flashblocks.base.org/flashblocks.svg";
    setCircles(newCircles);
    setFlipTime(Date.now());
  }

  function onImageClick(index: number) {
    const clickTime = Date.now();

    if (flipTime === 0) return;
    if (circles[index].src !== "https://flashblocks.base.org/flashblocks.svg")
      return;

    setReactionTime(clickTime);
  }

  function getResults() {
    if (
      reactionTime === 0 ||
      (reactionTime > regularConfirmationTime &&
        reactionTime > preconfirmationTime)
    ) {
      return "Not gonna lie, you're pretty bad at this.. You couldn't even beat regular confirmations.";
    }

    if (
      reactionTime < regularConfirmationTime &&
      reactionTime > preconfirmationTime
    ) {
      return "You're not bad, but you could've been faster. You beat the regular confirmation time but not the preconfs.";
    }

    if (
      reactionTime < regularConfirmationTime &&
      reactionTime < preconfirmationTime
    ) {
      return "HOLY SHIT! You're a wizard! You beat both the regular confirmations and the preconfs!";
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="size-96 relative bg-muted/30 rounded-lg border">
        {circles.map((circle, i) => (
          <img
            key={`circle-${circle.src}-${i}`}
            src={circle.src}
            alt="Base logo"
            className="absolute size-12 rounded-full object-cover"
            style={{ top: circle.top, left: circle.left }}
            onClick={() => onImageClick(i)}
          />
        ))}
      </div>

      {txHash && (
        <Link
          href={`https://sepolia.basescan.org/tx/${txHash}  `}
          target="_blank"
          className="flex items-center gap-2 p-2 border rounded-md justify-between"
        >
          {txHash.substring(0, 6)}...{txHash.substring(txHash.length - 4)}{" "}
          <div className="flex items-center gap-2">
            {preconfirmationTime > 0 ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="size-4 stroke-green-500" /> Preconf
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Loader2 className="size-4 animate-spin" /> Preconf
              </span>
            )}
            {regularConfirmationTime > 0 ? (
              <span className="flex items-center gap-1">
                <CheckCircle className="size-4 stroke-green-500" /> Regular
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Loader2 className="size-4 animate-spin" /> Regular
              </span>
            )}

            <ExternalLinkIcon className="size-4" />
          </div>
        </Link>
      )}

      <div className="flex items-center justify-between">
        <Button onClick={reset} variant={"destructive"}>
          Reset
        </Button>
        <Button onClick={initiateGame} disabled={!!txHash}>
          Start
        </Button>
      </div>

      <Dialog open={regularConfirmationTime > 0} onOpenChange={reset}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Game Over</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-2">
            <span className="font-bold">Reaction Time:</span>
            <span>
              {" "}
              {reactionTime > 0 ? reactionTime - txnBroadcastTime : "N/A "}ms
            </span>

            <span className="font-bold">Preconfirmation Time:</span>
            <span> {preconfirmationTime - txnBroadcastTime}ms</span>

            <span className="font-bold">Regular Confirmation Time:</span>
            <span> {regularConfirmationTime - txnBroadcastTime}ms</span>
          </div>

          <hr />

          <b>Results:</b>
          <p>{getResults()}</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
