
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { FaUserInjured, FaPrescriptionBottle, FaClock, FaArrowLeft } from "react-icons/fa";
import logo_white from "@/assets/logo_white.png";
import iconlogo from "@/assets/iconlogo.png";

const API = import.meta.env.VITE_API_BASE;
export default function DoctorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  // footer name
  const [profileName, setProfileName] = useState("Doctor");

  useEffect(() => {
    const token = localStorage.getItem("doctorToken");
    if (!token) return;
    (async () => {
      try {
        const res = await fetch(`${API}/doctor/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        const name = data?.data?.name;
        if (name && typeof name === "string") setProfileName(name);
      } catch {
        // ignore; keep default
      }
    })();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    navigate("/");
  };

  // NOTE: Logout has onClick -> treated as action (never active)
  const links = [
    { label: "Confirmed",    href: "/doctor/patients",    icon: <FaUserInjured className="h-5 w-5 shrink-0" /> },
    { label: "Appointment",  href: "/doctor/appointment", icon: <FaClock className="h-5 w-5 shrink-0" /> },
    { label: "Prescription", href: "/doctor/prescription",icon: <FaPrescriptionBottle className="h-5 w-5 shrink-0" /> },
    { label: "Logout",       href: "/", icon: <FaArrowLeft className="h-5 w-5 shrink-0 rounded" />, onClick: handleLogout },
  ];
  return (
    <div className="min-h-dvh w-full bg-neutral-900">
      <div className="flex h-dvh w-full overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          open={open}
          setOpen={setOpen}
          className="h-full bg-black w-[64px] md:w-[280px] lg:w-[300px]"
        >
          <SidebarBody
            className="h-full justify-between gap-10 bg-black"
            mobileLogo={<img src={logo_white} alt="BookMyDoc" className="h-6 w-auto" />}
          >
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}

              <div className="mt-8 flex flex-col gap-1">
                {links.map((link, idx) => {
                  const isAction = !!link.onClick;
                  const isActive =
                    !isAction && link.href !== "/" && location.pathname.startsWith(link.href);

                  return (
                    <SidebarLink
                      key={idx}
                      link={{
                        ...link,
                        href: isAction ? "#" : link.href, // prevent nav for actions
                        active: isActive,                  // whole row grey handled in SidebarLink
                      }}
                      className="text-neutral-200 hover:text-white"
                      onClick={(e) => {
                        if (isAction) {
                          e.preventDefault();
                          link.onClick?.();
                        }
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Footer Avatar Link with dynamic name */}
            <div>
              <SidebarLink
                link={{
                  label: profileName, // <-- dynamic doctor name
                  href: "/doctor/profile",
                  icon: (
                    <img
                      src="https://37assets.37signals.com/svn/765-default-avatar.png"
                      className="h-7 w-7 shrink-0 rounded-full"
                      alt="Avatar"
                    />
                  ),
                  active: location.pathname.startsWith("/doctor/profile"),
                }}
                className="text-neutral-200 hover:text-white"
              />
            </div>
          </SidebarBody>
        </Sidebar>

        {/* Main Content */}
        <main className="flex-1 min-w-0 overflow-auto pt-12 md:pt-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

/* Logos */
export const Logo = () => (
  <a href="/" className="relative z-20 flex items-center space-x-2 py-1">
    <motion.img
      src={logo_white}
      alt="Doctor Panel Logo"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-10 w-auto"
    />
  </a>
);

export const LogoIcon = () => (
  <a href="/" className="relative z-20 flex items-center space-x-2 py-1">
    <img src={iconlogo} alt="Logo Icon" className="h-10" />
  </a>
);
