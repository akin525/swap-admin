"use client";

import { X } from 'lucide-react';

export function SendMessageModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            {/* Added animate-in zoom for a smooth pop-up effect */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 m-4">

                {/* Modal Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">Send Message</h3>
                    <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                        Text Message
                    </label>
                    <textarea
                        rows={6}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:bg-white focus:ring-2 focus:ring-[#7C5CFF] text-sm resize-none transition-all placeholder:text-gray-300"
                        placeholder="Type your message here..."
                    />

                    {/* The design shows the Send button aligned right inside the modal */}
                    <div className="flex justify-end mt-4">
                        <button
                            onClick={onClose}
                            className="bg-[#7C5CFF] text-white font-bold py-2.5 px-8 rounded-xl hover:bg-[#6A4DED] transition-colors shadow-lg shadow-[#7C5CFF]/20"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}