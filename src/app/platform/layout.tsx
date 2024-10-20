"use client";

import { SessionProvider } from "next-auth/react";
import { HMSRoomProvider } from "@100mslive/react-sdk";

export default function PlatformLayout({ children }) {
  return (
    <div>
      <SessionProvider>
        <HMSRoomProvider>{children}</HMSRoomProvider>
      </SessionProvider>
    </div>
  );
}
