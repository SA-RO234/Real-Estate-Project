
import React from "react";
import { ChartAreaInteractive } from "../components/admin/chart-area-interactive";
import { SectionCards } from "../components/admin/section-cards";
import Messages from "../components/admin/messages";

export default function Page() {
  return (
    <div className="flex flex-col h-auto w-full gap-5 flex-wrap">
      <SectionCards />
      <div className="flex flex-row gap-5 w-full">
        <div className="flex-1">
          <ChartAreaInteractive />
        </div>
        <div className="w-[350px] ">
          <Messages />
        </div>
      </div>
    </div>
  );
}
