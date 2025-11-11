import { Moon, Sun, Box, TrendingUp, Target, Sigma, MapPin, Shapes, Presentation } from "lucide-react";
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
  { title: "Visualización 3D", url: "/3d-visualization", icon: Box },
  { title: "Dominio y Rango", url: "/domain-limits", icon: MapPin },
  { title: "Derivadas y Gradientes", url: "/derivatives", icon: TrendingUp },
  { title: "Optimización", url: "/optimization", icon: Target },
  { title: "Integrales", url: "/integrals", icon: Sigma },
  { title: "Superficies Cuádricas", url: "/quadric-surfaces", icon: Shapes },
  { title: "Exposición del Proyecto", url: "/presentation", icon: Presentation },
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
        <p className="text-xs text-sidebar-foreground/60">Cálculo Multivariable</p>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos</SidebarGroupLabel>
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
              <span>Modo Oscuro</span>
            </>
          ) : (
            <>
              <Sun className="h-4 w-4" />
              <span>Modo Claro</span>
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}