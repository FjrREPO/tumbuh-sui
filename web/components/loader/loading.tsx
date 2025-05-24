import { cn } from "@/lib/utils";

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        `fixed inset-0 z-[100] flex items-center justify-center backdrop-blur-sm`,
        className,
      )}
    >
      <div className="loader-custom" />
      {/* <div className="flex gap-4">
        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
          <div className="w-1 h-6 bg-green-500" />
          <div className="w-3 h-12 bg-green-500 rounded-sm" />
          <div className="w-1 h-6 bg-green-500" />
        </div>

        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.2s]">
          <div className="w-1 h-6 bg-red-500" />
          <div className="w-3 h-12 bg-red-500 rounded-sm" />
          <div className="w-1 h-6 bg-red-500" />
        </div>

        <div className="flex flex-col items-center animate-[bounce_1s_ease-in-out_infinite_0.1s]">
          <div className="w-1 h-6 bg-green-500" />
          <div className="w-3 h-12 bg-green-500 rounded-sm" />
          <div className="w-1 h-6 bg-green-500" />
        </div>
      </div> */}
    </div>
  );
}
