"use client"; // If using a database library, this usually stays on the server, but for this demo:

export async function registerUser(formData: FormData) {
    // Extract data from the form
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");
    const email = formData.get("email");
    const password = formData.get("password");

    // Logic: Here you would hash the password and save to your database (e.g., Prisma, MongoDB, Supabase)
    console.log("Registering:", { firstName, lastName, email });

    // Simulate a network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    return { success: true };
}