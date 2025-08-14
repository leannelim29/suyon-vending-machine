"use client";

import ItemButton from "@/components/ItemButton";
import { Change, Item } from "@/types";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const steps = [
  { id: 0, desc: "Please select a drink from the vending machine below:" },
  { id: 1, desc: "Select your payment method below:" },
];

const items = [
  { sku: "COLA", name: "Coca Cola", price: 1100, inStock: true },
  { sku: "WATER", name: "Nobrand Water", price: 600, inStock: true },
  { sku: "COFFEE", name: "Nobrand Coffee", price: 700, inStock: true },
];

export default function Home() {
  const [step, setStep] = useState(steps[0]);

  const [selectedItem, setSelectedItem] = useState<Item>();

  const handleClickDrink = (drink: Item) => {
    setStep(steps[1]);
    setSelectedItem(drink);
  };

  const [selectedPayment, setSelectedPayment] = useState<"cash" | "card">();

  const resetState = () => {
    setSelectedItem(undefined);
    setSelectedPayment(undefined);
    setStep(steps[0]);
  };

  useEffect(() => {
    if (selectedItem && !selectedPayment) {
      const timeout = setTimeout(() => {
        setSelectedItem(undefined);
        setStep(steps[0]);
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [selectedItem, selectedPayment]);

  const [confirmState, setConfirmState] = useState<{
    visible: boolean;
    message: string;
  }>({
    visible: false,
    message: "",
  });
  const resolverRef = useRef<((v: boolean) => void) | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      // Store resolver
      resolverRef.current = (v: boolean) => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        setConfirmState({ visible: false, message: "" });
        resolve(v);
      };
      // Show modal and start 5s auto-cancel
      setConfirmState({ visible: true, message });
      timerRef.current = setTimeout(() => {
        if (resolverRef.current) {
          const r = resolverRef.current;
          resolverRef.current = null;
          r(false);
        }
      }, 5000);
    });
  }

  function onConfirmClick(choice: boolean) {
    const r = resolverRef.current;
    resolverRef.current = null;
    if (r) r(choice);
  }

  const handlePaymentClick = async (paymentMethod: "cash" | "card") => {
    setSelectedPayment(paymentMethod);
    let paidAmount = 0;
    if (paymentMethod === "cash") {
      const userInput = prompt(
        `Please insert cash for ${selectedItem?.name} (${selectedItem?.price} won)`
      );
      if (!userInput) {
        toast("Payment canceled");
        resetState();
        return;
      }
      if (isNaN(Number(userInput))) {
        toast.error("Invalid amount. Please try again.");
        handlePaymentClick(paymentMethod);
        return;
      }
      paidAmount = Number(userInput);
      if (paidAmount < selectedItem!.price) {
        toast.error("Insufficient amount — payment refunded");
        resetState();
        return;
      }
    }
    const result = await fetch("/api/payments", {
      method: "POST",
      body: JSON.stringify({
        amount: paidAmount,
        method: paymentMethod,
      }),
    }).then((res) => res.json());

    if (result.status !== "received") {
      const retry = await showConfirm(`${result.message}. Retry?`);
      if (retry) handlePaymentClick(paymentMethod);
      else resetState();
      return;
    }

    const confirmed = await showConfirm(
      `You paid ${
        paymentMethod === "cash" ? result.paid : selectedItem?.price
      } won. Do you want to dispense?`
    );
    if (confirmed) {
      if (paymentMethod === "cash") {
        const changeResponse = await fetch(
          `/api/change-availability?price=${selectedItem?.price}&paid=${result.paid}`
        ).then((res) => res.json());
        if (!changeResponse.hasChange) {
          await fetch("/api/refund", {
            method: "POST",
          });
          toast.warning("Unable to provide change — payment refunded");
          resetState();
          return;
        } else if (changeResponse.remaining > 0) {
          toast.error(
            `Unable to provide exact change. Remaining: ${changeResponse.remaining} won — payment refunded`
          );
          resetState();
          return;
        } else
          toast.success(
            `Change provided: ${changeResponse.change
              .map((c: Change) => `${c.count} x ${c.unit} won`)
              .join(", ")}`
          );
      }
      await fetch("/api/dispense", {
        method: "POST",
      });
      toast.success("Please take your drink. Enjoy! 😊");
    } else {
      if (paymentMethod === "cash") toast("Payment canceled — refund issued");
      else toast("Payment canceled — returning to default state");
    }

    resetState();
  };

  return (
    <>
      <div className="text-3xl my-5 absolute -top-20 left-1/2 transform -translate-x-1/2 w-screen text-center">
        {step.desc}
      </div>
      <ItemButton
        className={`left-[300px] hover:border-red-600 ${
          selectedItem?.sku === "COLA" ? "border-2 border-red-600" : ""
        }`}
        onClick={() => handleClickDrink(items[0])}
      />
      <ItemButton
        className={`left-[430px] hover:border-blue-600 ${
          selectedItem?.sku === "WATER" ? "border-2 border-blue-600" : ""
        }`}
        onClick={() => handleClickDrink(items[1])}
      />
      <ItemButton
        className={`left-[557px] hover:border-yellow-600 ${
          selectedItem?.sku === "COFFEE" ? "border-2 border-yellow-600" : ""
        }`}
        onClick={() => handleClickDrink(items[2])}
      />

      {selectedItem && (
        <>
          <div className="absolute top-[150px] right-[200px] border-4 border-yellow-300 w-[110px] h-[410px]"></div>
          <div
            className="absolute top-[200px] right-[220px] w-[75px] h-[100px] cursor-pointer"
            title="Card"
            onClick={() => handlePaymentClick("card")}
          ></div>
          <div
            className="absolute top-[320px] right-[220px] w-[75px] h-[90px] cursor-pointer"
            title="Cash"
            onClick={() => handlePaymentClick("cash")}
          ></div>
          <div
            className="absolute top-[430px] right-[230px] w-[50px] h-[85px] cursor-pointer"
            title="Cash"
            onClick={() => handlePaymentClick("cash")}
          ></div>
          <div className="absolute top-1/2 left-[400px] text-black text-xl">
            selected: {selectedItem?.sku}
          </div>
          `
        </>
      )}
      {confirmState.visible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-[90%]">
            <p className="text-gray-900 mb-4">{confirmState.message}</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border border-gray-300"
                onClick={() => onConfirmClick(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white"
                onClick={() => onConfirmClick(true)}
              >
                OK
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-2">Auto-closes in 5s…</div>
          </div>
        </div>
      )}
    </>
  );
}
