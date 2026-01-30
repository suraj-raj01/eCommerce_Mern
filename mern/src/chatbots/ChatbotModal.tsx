import {
  DialogContent,
} from "../components/ui/dialog";
import ChatUI from "./Chatbot";

export default function ChatbotModal() {
  return (
    <DialogContent className="bg-transparent shadow-none border-none">
      <div className="h-full">
        <ChatUI/>
      </div>
    </DialogContent>
  );
}
