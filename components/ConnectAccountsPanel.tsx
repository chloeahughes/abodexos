"use client";
import { mockIntegrationState, getRelativeTime } from "@/lib/data.mock";

export default function ConnectAccountsPanel() {
  const { gmail, excel } = mockIntegrationState;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Connect Accounts</h2>

      <div className="space-y-6">
        {/* Gmail Section */}
        <div className="border-b border-gray-200 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-lg">✉️</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Gmail</h3>
          </div>

          {!gmail.connected ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Sync your Gmail to keep deals current. Just 2 clicks.
              </p>
              <a
                href={gmail.connectHref}
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Connect Gmail ✉️
              </a>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Connected — Last updated {gmail.lastUpdated ? getRelativeTime(gmail.lastUpdated) : 'recently'}
                </div>
              </div>

              {gmail.bullets && gmail.bullets.length > 0 && (
                <div className="space-y-2">
                  {gmail.bullets.map((bullet, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-red-50 rounded-lg"
                    >
                      <span className="text-red-600 text-sm">✉️</span>
                      <span className="text-sm text-gray-700">{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Excel Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg">📊</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Excel</h3>
          </div>

          {!excel.connected ? (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">
                Connect Excel to auto-fill Deal Details. Just 2 clicks.
              </p>
              <button
                onClick={() => {
                  // TODO: Wire Microsoft/Drive/Upload integration
                  console.log("Excel connect stub - TODO: implement integration");
                }}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Connect Excel 📊
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Connected — Last updated {excel.lastUpdated ? getRelativeTime(excel.lastUpdated) : 'recently'}
                </div>
              </div>

              {excel.bullets && excel.bullets.length > 0 && (
                <div className="space-y-2">
                  {excel.bullets.map((bullet, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                    >
                      <span className="text-green-600 text-sm">📊</span>
                      <span className="text-sm text-gray-700">{bullet}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
