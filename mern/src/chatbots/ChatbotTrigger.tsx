import { Bot } from "lucide-react";
import { Dialog, DialogTrigger } from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import ChatbotModal from "./ChatbotModal";

export default function ChatbotLauncher() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 bg-accent-foreground right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition">
          <Bot className="w-6 h-6" />
        </Button>
      </DialogTrigger>
      <ChatbotModal/>
    </Dialog>
  );
}
