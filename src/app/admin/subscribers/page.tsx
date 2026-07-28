import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { desc } from "drizzle-orm";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const allSubscribers = await db
    .select()
    .from(subscribers)
    .orderBy(desc(subscribers.subscribedAt));

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-void-white">Subscribers</h1>
          <p className="text-sm text-void-muted mt-1">
            {allSubscribers.length} total subscriber{allSubscribers.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {allSubscribers.length === 0 ? (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-void-muted text-sm">No subscribers yet.</p>
        </div>
      ) : (
        <div className="glass rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider hidden sm:table-cell">
                  Status
                </th>
                <th className="text-left text-xs font-medium text-void-muted px-4 py-3 uppercase tracking-wider hidden md:table-cell">
                  Subscribed
                </th>
              </tr>
            </thead>
            <tbody>
              {allSubscribers.map((sub) => (
                <tr key={sub.id} className="border-b border-white/5">
                  <td className="px-4 py-3 text-sm text-void-white">{sub.email}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                      sub.confirmed ? "text-green-400 bg-green-500/10" : "text-yellow-400 bg-yellow-500/10"
                    }`}>
                      {sub.confirmed ? "Confirmed" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-void-muted hidden md:table-cell">
                    {formatDate(sub.subscribedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
