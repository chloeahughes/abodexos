import ConnectAccountsPanel from '@/components/ConnectAccountsPanel';

export default function ConnectAccountsPage() {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Connect Accounts</h1>
        <p className="text-gray-600 mt-1">Connect your accounts to automate deal management</p>
      </div>

      <div className="max-w-4xl mx-auto">
        <ConnectAccountsPanel />
      </div>
    </div>
  );
}
