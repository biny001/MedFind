"use client";
import { authClient } from "@/lib/auth-client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Folder, Folders, Home, ShoppingBag } from "lucide-react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { Button } from "./ui/button";

const records = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Medicine",
    url: "/dashboard/medicine-detail",
    icon: ShoppingBag,
  },
  {
    title: "Users",
    url: "/dashboard/user",
    icon: Folder,
  },
  {
    title: "Profile",
    url: "/dashboard/profile",
    icon: Folders,
  },
];

export function AppSidebar() {
  const router = useRouter();
  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link href={"/"}>
              <h1 className=" text-2xl text-emerald-800 font-bold">MEDFIND</h1>
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Records</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {records.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} prefetch={true}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
          onClick={async () =>
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => router.push("/login"),
              },
            })
          }
        >
          LOG OUT
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
