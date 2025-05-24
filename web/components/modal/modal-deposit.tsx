import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/modal";
import React from "react";

export default function ModalDeposit({
  isOpen,
  setIsOpen,
  title,
  description,
}: {
  isOpen: boolean;
  setIsOpen: () => void;
  title: string;
  description: string;
}) {
  const [stakeAmount, setStakeAmount] = React.useState<string>("");

  const handleStakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (/^\d*\.?\d*$/.test(value)) {
      setStakeAmount(value);
    }
  };

  return (
    <Modal className="pb-5" isOpen={isOpen} onOpenChange={setIsOpen}>
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <span>{description}</span>
          <div>
            <div className="flex justify-between mb-2">
              <p className="text-sm">Initial Stake</p>
              <p className="text-xs text-gray-400">Balance: 5,234.78 USDT</p>
            </div>
            <div className="flex items-center gap-2">
              <Input
                className="bg-gray-800 border-gray-700"
                endContent={
                  <Button color="warning" size="sm" variant="flat">
                    MAX
                  </Button>
                }
                placeholder="0.00"
                type="number"
                value={stakeAmount}
                onChange={handleStakeAmountChange}
              />
              <Button color="warning" variant="bordered">
                USDT
              </Button>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Expected APY</p>
              <p className="text-sm font-mono text-warning">74.5%</p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Base APY</p>
              <p className="text-sm font-mono">72.5%</p>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Estimated Daily Rewards</p>
              <p className="text-sm font-mono text-success">
                ${(((Number(stakeAmount) || 0) * 74.5) / 100 / 365).toFixed(2)}
              </p>
            </div>
            <div className="flex justify-between mb-1">
              <p className="text-sm">Estimated Monthly Rewards</p>
              <p className="text-sm font-mono text-success">
                ${(((Number(stakeAmount) || 0) * 74.5) / 100 / 12).toFixed(2)}
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button className="w-full" color="warning" variant="solid">
              Create Position
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
