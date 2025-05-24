import Link from "next/link";

export default function CardCategory({
  item,
}: {
  item: {
    index: number;
    title: string;
    subtitle: string;
    tvl: string;
    icon: React.ReactNode;
  };
}) {
  return (
    <Link className="group" href={`/earn/vaults/?category=${item.title}`}>
      <div className="flex sm:h-20">
        <div className="flex w-10 shrink-0 items-center justify-center rounded-l-2xl border-b border-l border-t border-warning-300 bg-warning-25 text-xs font-bold">
          {item.index}
        </div>
        <div className="flex flex-1 flex-col items-center justify-between gap-4 rounded-br-2xl border border-warning-300 bg-neutral-25 px-4 py-6 group-hover:bg-warning-50 sm:flex-row sm:gap-0 sm:py-0">
          <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-0">
            <span className="mr-2 flex size-7 items-center justify-center rounded-full bg-warning-75 p-1">
              {item.icon}
            </span>
            <div className="block text-center sm:text-left">
              <p className="uppercase text-base tracking-normal font-mono font-bold leading-none antialiased">
                {item.title}
              </p>
              <p className="uppercase text-xs tracking-normal font-mono font-normal antialiased leading-4">
                {item.subtitle}
              </p>
            </div>
          </div>
          <div className="inline-flex gap-2 rounded-full border border-neutral-300 p-2 text-sm leading-4">
            TVL <b>{item.tvl}</b>
          </div>
        </div>
      </div>
    </Link>
  );
}
