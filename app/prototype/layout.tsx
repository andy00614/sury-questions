import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Prototype Research",
  description: "Experience our interactive learning app prototype and share your valuable feedback through our comprehensive user research survey.",
  openGraph: {
    title: "Interactive Prototype Research - Survey Question Platform",
    description: "Participate in cutting-edge user experience research. Test interactive prototypes and help shape the future of digital products.",
    images: ["/og-prototype.png"],
  },
  twitter: {
    title: "Interactive Prototype Research",
    description: "Experience interactive prototypes and share your UX insights",
  },
};

export default function PrototypeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}