"use client";;
import { cn } from "@/lib/utils";
import React, { useState, createContext, useContext } from "react";
import { AnimatePresence, motion } from "motion/react";
import { IconMenu2, IconX } from "@tabler/icons-react";

const SidebarContext = createContext(undefined);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true
}) => {
  const [openState, setOpenState] = useState(false);

  const open = openProp !== undefined ? openProp : openState;
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      {children}
    </SidebarProvider>
  );
};

export const SidebarBody = (props) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props)} />
    </>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <>
      <motion.div
        className={cn(
          "h-full px-4 py-4 hidden  md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 w-[300px] shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "300px" : "80px") : "300px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}>
        {children}
      </motion.div>
    </>
  );
};
export const MobileSidebar = ({
  className,
  children,
  mobileLogo,     // ← NEW: pass a React node (img/SVG) from the dashboard
  brandHref = "/",// ← optional brand link
  ...props
}) => {
  const { open, setOpen } = useSidebar();

  return (
    <>
      {/* Fixed top app bar (does NOT consume row width) */}
      <div
        className={cn(
          "fixed inset-x-0 top-0 h-12 md:hidden flex items-center justify-between px-4",
          "bg-neutral-100/80 dark:bg-neutral-800/80 backdrop-blur z-[60]"
        )}
        {...props}
      >
        <a href={brandHref} className="flex items-center gap-2">
          {mobileLogo ?? (
            <span className="text-sm font-semibold tracking-wide text-neutral-800 dark:text-neutral-200">
              BOOKMYDOC
            </span>
          )}
        </a>

        <button
          className="grid place-items-center rounded p-1.5"
          onClick={() => setOpen(!open)}
          aria-label="Open menu"
        >
          <IconMenu2 className="text-neutral-800 dark:text-neutral-200" />
        </button>
      </div>

      {/* Full-screen overlay drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[100] md:hidden bg-white dark:bg-neutral-900 p-10 flex flex-col justify-between",
              className
            )}
          >
            <div
              className="absolute right-6 top-3 z-50 text-neutral-800 dark:text-neutral-200"
              onClick={() => setOpen(false)}
              role="button"
              aria-label="Close menu"
            >
              <IconX />
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


// Sidebar.jsx
export const SidebarLink = ({
  link,            // { href, icon, label, active? }
  className,
  ...props
}) => {
  const { open, animate } = useSidebar();
  const isActive = Boolean(link?.active);

  return (
    <a
      href={link.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium cursor-pointer transition-colors",
        // text color
        "text-neutral-700 dark:text-neutral-200",
        // ENTIRE BOX turns grey on hover/focus
        "hover:bg-neutral-200 dark:hover:bg-neutral-700",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-300 dark:focus-visible:ring-neutral-600",
        // ACTIVE = grey box
        isActive && "bg-neutral-200 dark:bg-neutral-700",
        className
      )}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="whitespace-pre"
      >
        {link.label}
      </motion.span>
    </a>
  );
};

