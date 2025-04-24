import HomeLayout from "@/modules/home/ui/layouts/home-layout";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      {children}
    </div>
  );
}
