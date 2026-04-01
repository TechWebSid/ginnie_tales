"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { motion } from "framer-motion";

export default function UserDirectory() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const q = query(collection(db, "users"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const userList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(userList);
      } catch (error) {
        console.error("Error fetching explorers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div className="p-10 text-slate-400 font-bold animate-pulse">Scanning the Vault...</div>;

  return (
    <div className="bg-white border-[6px] border-white shadow-xl rounded-[3rem] overflow-hidden">
      <div className="p-8 bg-slate-50 border-b-4 border-slate-100 flex justify-between items-center">
        <h3 className="text-2xl font-[1000] text-slate-800 uppercase italic tracking-tighter">
          Explorer Directory <span className="text-blue-500">({users.length})</span>
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-xs font-black uppercase tracking-[0.2em]">
              <th className="px-8 py-6">Explorer</th>
              <th className="px-8 py-6">Role</th>
              <th className="px-8 py-6">Joined Date</th>
              <th className="px-8 py-6">UID</th>
            </tr>
          </thead>
          <tbody className="divide-y-4 divide-slate-50">
            {users.map((u) => (
              <motion.tr 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                key={u.id} 
                className="hover:bg-blue-50/30 transition-colors"
              >
                <td className="px-8 py-6">
                  <div className="flex flex-col">
                    <span className="font-black text-slate-700 uppercase italic text-sm">
                      {u.explorerName || u.displayName || "Unknown"}
                    </span>
                    <span className="text-xs text-slate-400 font-bold">{u.email}</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border-2 ${
                    u.role === 'admin' ? 'bg-purple-100 border-purple-200 text-purple-600' : 'bg-blue-100 border-blue-200 text-blue-600'
                  }`}>
                    {u.role || 'user'}
                  </span>
                </td>
                <td className="px-8 py-6 font-bold text-slate-500 text-sm">
                  {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString() : "Ancient"}
                </td>
                <td className="px-8 py-6 font-mono text-[10px] text-slate-300">
                  {u.id}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}