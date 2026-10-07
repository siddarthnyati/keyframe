"use client";

import { Suspense } from "react";
import { Updates } from "@/app/production/update/page";

export default function CampaignStatus() {
  return (
    <Suspense>
      <Updates mode="campaign" />
    </Suspense>
  );
}
