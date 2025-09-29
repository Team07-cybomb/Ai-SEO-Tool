import { connectDB } from "../../../../lib/mongodb";
import ContactMessage from "../../../../server/models/contactMessage";

export default async function MessagesPage() {
  await connectDB();
  const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Support Messages</h1>
      <div className="space-y-4">
        {messages.map((msg: any) => (
          <div key={msg._id} className="p-4 border rounded-lg">
            <h2 className="font-semibold">{msg.subject}</h2>
            <p className="text-sm">{msg.message}</p>
            <p className="text-xs text-gray-500">
              Priority: {msg.priority} | Type: {msg.type}
            </p>
            <p className="text-xs text-gray-400">
              Received: {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
