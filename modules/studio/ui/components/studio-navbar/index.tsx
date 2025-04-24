import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { StudioUploadModal } from "../studio-sidebar/studio-upload-modal";

export const StudioNavbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50 border-b shadow-md">
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link prefetch href="/studio">
            <p className="text-xl font-semibold tracking-tight">
              Courant Studio
            </p>
          </Link>
        </div>

        {/* Spacer */}
        <div className="flex-1"></div>

        <div className="flex-shrink-0 items-center flex gap-4">
          <StudioUploadModal />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
};
