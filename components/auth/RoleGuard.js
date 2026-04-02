"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation"; // Pathname add kiya debug ke liye
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function RoleGuard({ children, allowedRoles }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push("/signin");
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userRole = userDoc.data().role;

          if (allowedRoles.includes(userRole)) {
            setAuthorized(true);
          } else {
            // 🛡️ STRICT RE-DIRECTION
            if (userRole === "admin") {
              router.push("/admin/dashboard");
            } else if (userRole === "operational") {
              router.push("/operations");
            } else {
              router.push("/dashboard");
            }
          }
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Auth Guard Error:", error);
      }
    });

    return () => unsubscribe();
  }, [router, allowedRoles, pathname]);

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-white font-bold tracking-widest animate-pulse uppercase text-xs">
          Verifying Clearance...
        </p>
      </div>
    );
  }

  return children;
}