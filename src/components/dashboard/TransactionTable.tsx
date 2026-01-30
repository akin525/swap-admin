export function TransactionTable() {
    return (
        <div className="bg-card border border-border rounded-[2rem] shadow-sm overflow-hidden mt-8">
            <div className="p-8 border-b border-border flex justify-between items-center">
                <h3 className="text-xl font-bold">Recent Transactions</h3>
                <button className="text-brand font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="text-slate-400 text-[10px] uppercase tracking-[0.1em] border-b border-border">
                        <th className="px-8 py-5 text-left font-semibold">ID</th>
                        <th className="px-8 py-5 text-left font-semibold">User</th>
                        <th className="px-8 py-5 text-left font-semibold">Description</th>
                        <th className="px-8 py-5 text-left font-semibold">Action</th>
                        <th className="px-8 py-5 text-left font-semibold">Amount</th>
                        <th className="px-8 py-5 text-left font-semibold">Issued Date</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                    {/* Example Row matching your screenshot */}
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-8 py-6 text-brand font-bold text-sm">#5089</td>
                        <td className="px-8 py-6 font-semibold text-sm">John Doe</td>
                        <td className="px-8 py-6 text-slate-500 dark:text-slate-400 text-sm">john receive ₦50,000 from Tolu</td>
                        <td className="px-8 py-6 text-sm">Transfer NGN</td>
                        <td className="px-8 py-6 font-bold text-sm">₦50,000</td>
                        <td className="px-8 py-6 text-slate-400 text-xs">31 Mar 2025 10:45 AM</td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}