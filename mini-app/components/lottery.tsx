"use client";

import { useState } from "react";
import { useAccount, useContractRead, useContractWrite, useWaitForTransaction } from "wagmi";
import { base } from "wagmi/chains";
import { Button } from "@/components/ui/button";
import Confetti from "react-confetti";

const contractAddress = process.env.NEXT_PUBLIC_LOTTERY_CONTRACT as `0x${string}`;
const abi = [
  {
    "inputs": [],
    "name": "getPotBalance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "buyTicket",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export default function Lottery() {
  const { address } = useAccount();
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: pot, refetch: refetchPot } = useContractRead({
    address: contractAddress,
    abi,
    functionName: "getPotBalance",
  });

  const { data: txHash, writeContractAsync } = useContractWrite({
    address: contractAddress,
    abi,
    functionName: "buyTicket",
    value: BigInt(1_000_000_000_000_000), // 0.001 ETH
  });

  const { isLoading } = useWaitForTransaction({
    hash: txHash,
    onSuccess: () => {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      refetchPot();
    },
  });

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-semibold">Pot Size</h2>
      <p className="text-2xl font-mono">{pot ? (Number(pot) / 1e18).toFixed(3) + " ETH" : "Loading..."}</p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => writeContractAsync?.()}
        disabled={!address || isLoading}
      >
        {isLoading ? "Buying…" : "Buy Ticket (0.001 ETH)"}
      </Button>
      {showConfetti && <Confetti />}
    </div>
  );
}
