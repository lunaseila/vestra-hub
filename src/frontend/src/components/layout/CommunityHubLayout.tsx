import CommunityHubNavBar from "@/components/layout/CommunityHubNavBar";
import { Outlet } from "@tanstack/react-router";

export default function CommunityHubLayout() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--ch-bg-base)",
        color: "var(--ch-text-primary)",
        fontFamily: "DM Sans, system-ui, sans-serif",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      <CommunityHubNavBar />
      <Outlet />
    </div>
  );
}
