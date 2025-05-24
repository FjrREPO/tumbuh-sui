"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Chip } from "@heroui/chip";
import { addToast } from "@heroui/toast";

import { urlExplorer } from "@/lib/utils";
import { formatDateToDMY, normalizeTVL } from "@/lib/helper";
import { DECIMALS_MOCK_TOKEN } from "@/lib/constants";
import { vaultsData } from "@/data/vaults-data";

export default function VaultComponent({ vaultId }: { vaultId: string }) {
  const findVault = vaultsData.find((vault) => vault.id === vaultId);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    addToast({
      title: "Copied to clipboard",
      description: "The address has been copied to your clipboard.",
      variant: "flat",
      color: "success",
      timeout: 2000,
    });
  };

  const [activeTab, setActiveTab] = useState("DETAILS");

  if (!findVault) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <p className="text-xl font-mono">Vault not found</p>
      </div>
    );
  }

  return (
    <section className="max-w-screen relative flex w-full grow flex-col items-stretch md:max-w-none">
      <header className="mb-5">
        <div
          className="flex h-20 shrink-0 items-center justify-center border-b-0.5 border-neutral-500 bg-gradient-to-b from-neutral from-10% to-primary-25 to-90% bg-cover bg-left bg-no-repeat px-6 md:justify-end"
          style={{
            backgroundImage: 'url("/assets/abstract.jpeg")',
          }}
        >
          <div className="flex items-center gap-2">
            <Link href={findVault.protocol.links.website} target="_blank">
              <div className="z-10 flex h-10 min-w-10 bg-white text-black items-center justify-center gap-2 border-1 border-neutral-1000 bg-primary-25 px-2 transition-colors duration-200 hover:bg-gray-300 cursor-pointer">
                <div className="uppercase text-base tracking-normal font-mono font-normal leading-none antialiased mx-2 hidden md:block">
                  {findVault.protocol.name}
                </div>
                <svg
                  className="stroke-0"
                  fill="none"
                  height="20"
                  viewBox="0 0 20 20"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 3H6C4.34315 3 3 4.34315 3 6V14C3 15.6569 4.34315 17 6 17H14C15.6569 17 17 15.6569 17 14V10H18V14C18 16.2091 16.2091 18 14 18H6C3.79086 18 2 16.2091 2 14V6C2 3.79086 3.79086 2 6 2H10V3Z"
                    fill="currentColor"
                  />
                  <path
                    d="M16.4338 3H12V2H18V8H17V3.84806L10.3248 10.5233L9.61768 9.81615L16.4338 3Z"
                    fill="currentColor"
                  />
                </svg>
              </div>
            </Link>
            <div
              className="z-10 flex h-10 min-w-10 bg-white text-black items-center justify-center gap-2 border-1 border-neutral-1000 bg-primary-25 px-2 transition-colors duration-200 hover:bg-gray-300 cursor-pointer"
              role="button"
              tabIndex={0}
              onClick={() => copyToClipboard(window.location.href)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  copyToClipboard(window.location.href);
                }
              }}
            >
              <div className="uppercase text-base tracking-normal font-mono font-normal leading-none antialiased mx-2 hidden md:block">
                Share
              </div>
              <svg
                className="stroke-0"
                fill="none"
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M14.5 5C14.5 6.10457 13.6046 7 12.5 7C12.1272 7 11.7783 6.89802 11.4796 6.72045L9.22045 8.97955C9.39802 9.2783 9.5 9.62724 9.5 10C9.5 10.3728 9.39802 10.7217 9.22045 11.0204L11.4796 13.2796C11.7783 13.102 12.1272 13 12.5 13C13.6046 13 14.5 13.8954 14.5 15C14.5 16.1046 13.6046 17 12.5 17C11.3954 17 10.5 16.1046 10.5 15C10.5 14.6272 10.602 14.2783 10.7796 13.9796L8.52045 11.7204C8.2217 11.898 7.87276 12 7.5 12C6.39543 12 5.5 11.1046 5.5 10C5.5 8.89543 6.39543 8 7.5 8C7.87276 8 8.2217 8.10198 8.52045 8.27955L10.7796 6.02045C10.602 5.7217 10.5 5.37276 10.5 5C10.5 3.89543 11.3954 3 12.5 3C13.6046 3 14.5 3.89543 14.5 5ZM13.5 5C13.5 5.55228 13.0523 6 12.5 6C11.9477 6 11.5 5.55228 11.5 5C11.5 4.44772 11.9477 4 12.5 4C13.0523 4 13.5 4.44772 13.5 5ZM13.5 15C13.5 15.5523 13.0523 16 12.5 16C11.9477 16 11.5 15.5523 11.5 15C11.5 14.4477 11.9477 14 12.5 14C13.0523 14 13.5 14.4477 13.5 15ZM7.5 11C8.05228 11 8.5 10.5523 8.5 10C8.5 9.44772 8.05228 9 7.5 9C6.94772 9 6.5 9.44772 6.5 10C6.5 10.5523 6.94772 11 7.5 11Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-10">
        <div className="col-span-2 flex flex-1 flex-col items-center px-4 md:order-2 md:flex-col-reverse md:items-start md:px-6 xl:col-span-1">
          <div className="sup-breadcrumbs flex gap-2 items-center no-scrollbar max-w-full overflow-y-auto">
            <Link
              className="decoration-from-font lg:hover:text-primary-600 h-6 flex items-center justify-center"
              href="/earn/vaults/"
            >
              <span className="uppercase text-base tracking-normal font-mono font-normal leading-none antialiased whitespace-nowrap">
                Vaults
              </span>
            </Link>
            <span className="sup-breadcrumb-separator inline-flex w-10 justify-center">
              <svg
                fill="none"
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 15L13 10L7 5" stroke="currentColor" />
              </svg>
            </span>
            <Link
              className="decoration-from-font lg:hover:text-primary-600 h-6 flex items-center justify-center"
              href={`/earn/protocol/${findVault.protocol.id}`}
            >
              <span className="uppercase text-base tracking-normal font-mono font-normal leading-none antialiased whitespace-nowrap">
                {findVault.protocol.name}
              </span>
            </Link>
            <span className="sup-breadcrumb-separator inline-flex w-10 justify-center">
              <svg
                fill="none"
                height="20"
                viewBox="0 0 20 20"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M7 15L13 10L7 5" stroke="currentColor" />
              </svg>
            </span>
            <span className="sup-breadcrumb gap-2 flex h-6 cursor-default items-center justify-center">
              <span className="uppercase text-base tracking-normal font-mono font-normal leading-none antialiased whitespace-nowrap">
                {findVault.name}
              </span>
            </span>
          </div>
          <div className="mt-5 flex max-w-full flex-1 flex-col items-center overflow-hidden md:mt-2 md:flex-col-reverse md:items-start">
            <div className="inline-flex items-center md:mb-4 xl:mb-9">
              <h2 className="uppercase font-sans font-black tracking-normal max-w-full text-center text-3xl md:overflow-hidden md:text-ellipsis md:whitespace-nowrap md:text-left md:text-5xl md:leading-none xl:text-7xl">
                {findVault.name}
              </h2>
            </div>
            <div className="mb-1 flex flex-col items-center gap-2 md:flex-row">
              <h6 className="uppercase text-xl font-sans font-bold tracking-normal leading-none">
                {findVault.symbol}
              </h6>
              <Chip color="success" variant="flat">
                Authenticated
              </Chip>
            </div>
          </div>
        </div>
        <div className="col-span-2 flex px-4 md:order-3 md:mt-8 md:px-6 xl:col-span-1 xl:mt-0 xl:items-end">
          <div className="flex flex-1 flex-col items-stretch justify-end gap-4 md:flex-row md:items-center md:justify-stretch xl:items-end">
            <div className="min-w-[175px] flex-grow rounded-l-full rounded-br-full border-[1px] px-6 py-4 text-right border-white">
              <h4 className="font-mono text-xs uppercase leading-4">
                Vault TVL
              </h4>
              <div className="font-mono text-3xl font-bold leading-9">
                {normalizeTVL(
                  findVault.vault_statistics.tvl_now,
                  DECIMALS_MOCK_TOKEN,
                )}
              </div>
            </div>

            <div className="min-w-[175px] flex-grow rounded-l-full rounded-br-full border-[1px] px-6 py-4 text-right border-white">
              <h4 className="font-mono text-xs uppercase leading-4">
                Vault APY
              </h4>
              <div className="font-mono text-3xl font-bold leading-9">
                <div className="inline-flex flex-none justify-center cursor-pointer">
                  <div className="sup-asset-label inline-flex w-fit items-center gap-0.5 h-8">
                    <div className="inline-flex flex-col justify-center items-start shrink-0 gap-1">
                      {findVault.vault_statistics.apy_now.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="min-w-[175px] flex-grow rounded-l-full rounded-br-full border-[1px] px-6 py-4 text-right border-white">
              <h4 className="font-mono text-xs uppercase leading-4">
                Vault Sharpe
              </h4>
              <div className="font-mono text-3xl font-bold leading-9">
                {findVault.vault_statistics.sharpe_day.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="my-6 flex min-h-[368px] flex-col gap-6 rounded-bl-[48px] rounded-br-[48px] rounded-tl-[48px] bg-primary-50 px-4 py-6 md:px-6"
        style={{ backgroundColor: "rgba(64, 64, 64, 0.3)" }}
      >
        <div className="flex flex-col gap-4 lg:flex-row">
          <div
            className="custom-scrollbar flex-1 overflow-y-auto"
            style={{ maxHeight: "865px" }}
          >
            <p className="uppercase text-base tracking-normal font-mono font-normal antialiased whitespace-pre-wrap leading-5">
              {findVault.description}
            </p>
          </div>

          <div className="flex-1 uppercase xl:flex-[2]">
            <div className="flex shrink-0 items-center justify-center gap-[1px] divide-x divide-neutral-600 border-x-1 border-t-1 border-neutral-600 font-mono">
              {["DETAILS", "METRICS"].map((tab) => (
                <button
                  key={tab}
                  className={`basis-full py-2 text-xs uppercase leading-[12px] tracking-wider ${
                    tab === activeTab
                      ? "bg-neutral"
                      : "border-b-1 border-neutral-600 bg-transparent"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="sup-list-table border-1 border-neutral-600 border-t-0 bg-neutral">
              <div className="sup-list-table-rows px-4 ">
                {activeTab === "DETAILS" &&
                  [
                    ["Vault name", findVault.name],
                    ["Vault Symbol", findVault.symbol],
                    ["List date", findVault.deploy_date],
                    [
                      "Contract Address",
                      <>
                        <div className="flex space-x-2 items-center">
                          <Link
                            className=" underline underline-offset-2 hover:no-underline text-[16px] w-full overflow-hidden text-ellipsis whitespace-nowrap"
                            href={urlExplorer({
                              address: findVault.contract_address,
                            })}
                            target="_blank"
                          >
                            <p className="text-base font-mono leading-none">
                              {findVault.contract_address}
                            </p>
                          </Link>
                          <button
                            onClick={() =>
                              copyToClipboard(findVault.contract_address)
                            }
                          >
                            <svg
                              className="h-[20px] w-[20px]"
                              fill="none"
                              height="20"
                              viewBox="0 0 20 20"
                              width="20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                clipRule="evenodd"
                                d="M6.78571 7.33333C4.41878 7.33333 2.5 9.24359 2.5 11.6V13.7333C2.5 16.0897 4.41878 18 6.78571 18H8.92857C11.2955 18 13.2143 16.0897 13.2143 13.7333V12.6667C15.5812 12.6667 17.5 10.7564 17.5 8.4V2H11.0714C8.70449 2 6.78571 3.91025 6.78571 6.26667V7.33333ZM16.4286 3.06667H11.0714C9.29623 3.06667 7.85714 4.49936 7.85714 6.26667V7.33333H13.2143V11.6C14.9895 11.6 16.4286 10.1673 16.4286 8.4V3.06667ZM12.1429 8.4H6.78571C5.01051 8.4 3.57143 9.83269 3.57143 11.6V13.7333C3.57143 15.5006 5.01051 16.9333 6.78571 16.9333H8.92857C10.7038 16.9333 12.1429 15.5006 12.1429 13.7333V8.4Z"
                                fill="currentColor"
                                fillRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </>,
                    ],
                    [
                      "Yield type",
                      <span
                        key="yield-type"
                        className="inline-flex  min-h-[20px] border-1 border-neutral-300 bg-neutral p-1 text-[12px] font-mono"
                      >
                        {findVault.yield_type}
                      </span>,
                    ],
                    [
                      "External URL",
                      <Link
                        key="external-url"
                        className=" underline underline-offset-2 hover:no-underline max-w-[500px]"
                        href={findVault.external_url}
                        target="_blank"
                      >
                        <p className="uppercase font-mono text-base leading-none overflow-hidden text-ellipsis">
                          {findVault.protocol.vanity_url}
                        </p>
                      </Link>,
                    ],
                    ["Last updated", formatDateToDMY(findVault.updated_at)],
                  ].map(([label, value], index) => (
                    <div
                      key={index}
                      className="sup-list-table-row flex border-b-0.5 border-neutral-100 last-of-type:border-b-0 flex-col md:flex-row md:justify-between"
                    >
                      <div className="uppercase text-xs tracking-normal font-mono font-normal leading-[3.25rem] ">
                        {label}
                      </div>
                      <div className="no-scrollbar flex h-[3.25rem] items-center overflow-x-auto ">
                        {typeof value === "string" ? (
                          <p className="uppercase text-base font-mono leading-none">
                            {value}
                          </p>
                        ) : (
                          value
                        )}
                      </div>
                    </div>
                  ))}

                {activeTab === "METRICS" &&
                  [
                    ["24H APY", findVault.vault_statistics.apy_day],
                    ["7D APY", findVault.vault_statistics.apy_week],
                    ["30D APY", findVault.vault_statistics.apy_month],
                    [
                      "TVL",
                      normalizeTVL(
                        findVault.vault_statistics.tvl_now,
                        DECIMALS_MOCK_TOKEN,
                      ),
                    ],
                    [
                      "TVL Daily Change",
                      normalizeTVL(
                        findVault.vault_statistics.tvl_day_change,
                        DECIMALS_MOCK_TOKEN,
                      ),
                    ],
                    [
                      "TVL Weekly Change",
                      normalizeTVL(
                        findVault.vault_statistics.tvl_week_change,
                        DECIMALS_MOCK_TOKEN,
                      ),
                    ],
                    [
                      "TVL Monthly Change",
                      normalizeTVL(
                        findVault.vault_statistics.tvl_month_change,
                        DECIMALS_MOCK_TOKEN,
                      ),
                    ],
                  ].map(([label, value], index) => (
                    <div
                      key={index}
                      className="sup-list-table-row flex border-b-0.5 border-neutral-100 last-of-type:border-b-0 flex-col md:flex-row md:justify-between"
                    >
                      <div className="uppercase text-xs tracking-normal font-mono font-normal leading-[3.25rem] ">
                        {label}
                      </div>
                      <div className="no-scrollbar flex h-[3.25rem] items-center overflow-x-auto ">
                        <p className="uppercase text-base font-mono leading-none">
                          {value}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
