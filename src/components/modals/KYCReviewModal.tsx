export function KYCReviewModal({ applicant, onClose }: any) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className="bg-card text-card-foreground w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 border border-border">
                <div className="p-8 border-b border-border flex justify-between items-center">
                    <h2 className="text-xl font-bold">KYC Review</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-500">✕</button>
                </div>

                <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    {/* ID & Status Header */}
                    <div className="flex justify-between border-b border-dashed border-border pb-4">
                        <div>
                            <p className="text-xs text-slate-400">Transaction ID</p>
                            <p className="font-bold">TX123456</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs text-slate-400">Status</p>
                            <p className="font-bold text-orange-500">Pending Review</p>
                        </div>
                    </div>

                    {/* Applicant Info vs Checklist */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold border-b border-border pb-2">Applicant Info</h4>
                            <InfoRow label="Name" value={applicant.name} />
                            <InfoRow label="Email" value="john@gmail.com" />
                            <InfoRow label="Phone" value="+2348168192858" />
                            <InfoRow label="Country" value={applicant.country} />
                            <InfoRow label="Level" value={applicant.level.toString()} />
                            <InfoRow label="Applied" value="2h ago" />
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-sm font-bold border-b border-border pb-2">Verification Checklist</h4>
                            <CheckItem label="Name matches ID document" />
                            <CheckItem label="Photo quality acceptable" />
                            <CheckItem label="Address clearly visible" />
                            <CheckItem label="Document not expired" />
                            <CheckItem label="No signs of tampering" />
                            <CheckItem label="Selfie matches ID photo" />
                        </div>
                    </div>

                    {/* Document Previews */}
                    <div className="space-y-6">
                        <DocPreview label="ID Document" />
                        <DocPreview label="Selfie" />
                        <DocPreview label="Bill Img" />
                    </div>

                    {/* Admin Notes */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold">Add Note:</label>
                        <textarea
                            placeholder="Admin notes"
                            className="w-full p-4 bg-slate-50 dark:bg-slate-800/50 border border-border rounded-2xl outline-none focus:ring-2 focus:ring-brand/20 h-24"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-4">
                        <button className="flex-1 bg-brand text-white py-4 rounded-2xl font-bold shadow-lg shadow-brand/20 active:scale-95 transition-all">
                            Approve Transaction
                        </button>
                        <button className="flex-1 bg-orange-500 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all">
                            Reject
                        </button>
                        <button className="flex-1 bg-slate-900 dark:bg-slate-700 text-white py-4 rounded-2xl font-bold active:scale-95 transition-all">
                            Request Info
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Sub-components
function InfoRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex justify-between text-xs">
            <span className="text-slate-500">{label}:</span>
            <span className="font-bold">{value}</span>
        </div>
    );
}

function CheckItem({ label }: { label: string }) {
    return (
        <label className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-border bg-transparent text-brand focus:ring-brand" />
            {label}
        </label>
    );
}

function DocPreview({ label }: { label: string }) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-bold">{label}</p>
            <div className="w-full aspect-video bg-slate-900 rounded-3xl flex items-center justify-center relative group overflow-hidden border-4 border-slate-800">
                <span className="text-white font-medium">Preview</span>
                {/* Background Passport Pattern would go here */}
                <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
            </div>
        </div>
    );
}