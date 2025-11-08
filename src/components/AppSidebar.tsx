import { Moon, Sun, Box, TrendingUp, Target, Sigma, MapPin, Plane, Shapes } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const menuItems = [
  { title: "3D Visualization", url: "/3d-visualization", icon: Box },
  { title: "Lines & Planes 3D", url: "/lines-planes-3d", icon: Plane },
  { title: "Quadric Surfaces", url: "/quadric-surfaces", icon: Shapes },
  { title: "Derivatives", url: "/derivatives", icon: TrendingUp },
  { title: "Optimization", url: "/optimization", icon: Target },
  { title: "Integrals", url: "/integrals", icon: Sigma },
  { title: "Domain & Limits", url: "/domain-limits", icon: MapPin },
];

export function AppSidebar() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
        <h2 className="text-lg font-bold text-sidebar-primary">MultiCalc</h2>
        <p className="text-xs text-sidebar-foreground/60">Multivariable Calculus</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Modules</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className="flex items-center gap-3 hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="w-full justify-start gap-2"
        >
          {theme === "light" ? (
            <>
              <Moon className="h-4 w-4" />
              <span>Dark Mode</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Light Mode</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}