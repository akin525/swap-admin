"use client";

import React, { useState } from 'react';
import { registerUser } from '../../action'; // Import the action we just made

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setIsLoading(true);
        const result = await registerUser(formData);
        if (result.success) {
            alert("Registration Successful!");
        }
        setIsLoading(false);
    }

    return (

            <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4 font-sans">
            <div className="w-full max-w-[480px] rounded-2xl border border-gray-100 p-8 shadow-sm">

                <span className="text-2xl font-bold tracking-tight text-gray-900">Conerpulse </span>

                <h1 className="mb-6 text-3xl font-bold">Get's started.</h1>

                {/* Important: use 'action' instead of 'onSubmit' for Next.js Actions */}
                <form action={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-gray-700">First Name</label>
                            <input
                                name="firstName" // Added name attribute
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7C5CFF]"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium text-gray-700">Last Name</label>
                            <input
                                name="lastName" // Added name attribute
                                required
                                className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7C5CFF]"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Email</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7C5CFF]"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none focus:border-[#7C5CFF]"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full rounded-xl bg-[#7C5CFF] py-4 font-bold text-white shadow-lg transition-all active:scale-[0.98] disabled:bg-gray-400"
                    >
                        {isLoading ? "Creating Account..." : "Create Account"}
                    </button>
                </form>
            </div>
        </div>
    );
}