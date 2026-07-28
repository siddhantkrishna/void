import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await db.select().from(siteSettings).orderBy(desc(siteSettings.key));

  return (
    <div>
      <h1 className="text-2xl font-bold text-void-white mb-8">Settings</h1>

      <div className="glass rounded-xl p-6">
        <h2 className="text-sm font-semibold text-void-white mb-4">Site Configuration</h2>
        
        {settings.length === 0 ? (
          <p className="text-void-muted text-sm">No settings configured yet.</p>
        ) : (
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-center justify-between py-3 border-b border-white/5 last:border-0">
                <div>
                  <p className="text-sm text-void-white font-medium">
                    {setting.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                  </p>
                  <p className="text-xs text-void-muted mt-0.5">{setting.key}</p>
                </div>
                <p className="text-sm text-void-muted max-w-xs truncate">
                  {setting.value || "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="glass rounded-xl p-6 mt-6">
        <h2 className="text-sm font-semibold text-void-white mb-4">Admin Credentials</h2>
        <div className="text-sm text-void-muted space-y-2">
          <p><strong>Default Email:</strong> admin@void.dev</p>
          <p><strong>Default Password:</strong> admin123456</p>
          <p className="text-xs text-void-muted/60 mt-3">
            Change these credentials in production by updating the database directly.
          </p>
        </div>
      </div>
    </div>
  );
}
