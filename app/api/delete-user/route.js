import { adminAuth } from "@/firebaseAdmin";

export const POST = async (req, res) => {
  const { uid } = await req.json(); // `req.json()` înlocuiește `req.body` pentru API Routes în Next.js 13

  try {
    await adminAuth.deleteUser(uid); // Șterge utilizatorul din Authentication
    return new Response("User deleted from Authentication successfully.", {
      status: 200,
    });
  } catch (error) {
    console.error("Error deleting user from Authentication:", error);
    return new Response("Failed to delete user.", { status: 500 });
  }
};
