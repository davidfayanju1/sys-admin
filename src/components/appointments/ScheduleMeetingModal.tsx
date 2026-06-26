import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Video,
  Send,
  User,
  Calendar,
  Briefcase,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { Appointment } from "../../hooks/useAppointments";
import { useScheduleMeeting } from "../../hooks/useAppointments";

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

const generateMeetLink = () => {
  const alpha = "abcdefghijklmnopqrstuvwxyz";
  const seg = (n: number) =>
    Array.from({ length: n }, () => alpha[Math.floor(Math.random() * alpha.length)]).join("");
  return `https://meet.google.com/${seg(3)}-${seg(4)}-${seg(3)}`;
};

const buildInviteTemplate = (a: Appointment, link: string) =>
  `Hi ${a.name.split(" ")[0]},

Your virtual consultation with SYS Empire is confirmed. Join using the link below:

Google Meet: ${link}

Date:    ${new Date(a.scheduledAt).toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
Service: ${a.service}
Type:    ${a.type.replace(/-/g, " ")}
${a.notes ? `\nNotes: "${a.notes}"\n` : ""}
The link will be active 5 minutes before your session. Please ensure you are in a quiet space with a stable internet connection.

If you have any questions before the session, simply reply to this email.

See you soon!

Warm regards,
The SYS Empire Team`;

const ScheduleMeetingModal = ({ appointment, onClose }: Props) => {
  const [meetLink, setMeetLink] = useState(generateMeetLink);
  const [body, setBody] = useState(() => buildInviteTemplate(appointment, meetLink));
  const [copied, setCopied] = useState(false);

  const scheduleMeeting = useScheduleMeeting();

  const regenerateLink = useCallback(() => {
    const newLink = generateMeetLink();
    setMeetLink(newLink);
    setBody(buildInviteTemplate(appointment, newLink));
  }, [appointment]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(meetLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Could not copy to clipboard");
    }
  };

  const handleSend = () => {
    if (!meetLink.trim() || !body.trim()) return;
    scheduleMeeting.mutate(
      { id: appointment.sourceId, meetingLink: meetLink, message: body },
      {
        onSuccess: () => {
          toast.success(`Meeting invite sent to ${appointment.email}`);
          onClose();
        },
        onError: () => {
          toast.error("Failed to send invite. Please try again.");
        },
      }
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/50"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 8 }}
          transition={{ duration: 0.18 }}
          className="relative bg-white w-full max-w-xl mx-4 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-black/10 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#1a73e8] flex items-center justify-center">
                <Video className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-light tracking-wide text-black">Schedule Meeting</h3>
                <p className="text-[10px] text-black/40 mt-0.5">Virtual Consultation — Google Meet</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 hover:bg-black/5 transition text-black/40">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Client summary strip */}
          <div className="px-6 py-3 bg-black/2 border-b border-black/5 flex flex-wrap gap-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-black/30" />
              <span className="text-[11px] text-black/60 font-light">{appointment.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-black/30" />
              <span className="text-[11px] text-black/60 font-light">
                {new Date(appointment.scheduledAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3 h-3 text-black/30" />
              <span className="text-[11px] text-black/60 font-light">{appointment.service}</span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {/* Meet Link */}
            <div>
              <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                Google Meet Link
              </label>
              <div className="flex items-stretch gap-0">
                <div className="flex-1 flex items-center gap-2 px-3 py-2.5 border border-black/10 border-r-0 bg-[#f8fbff]">
                  <Video className="w-3.5 h-3.5 text-[#1a73e8] shrink-0" />
                  <input
                    type="text"
                    value={meetLink}
                    onChange={(e) => {
                      setMeetLink(e.target.value);
                      setBody(buildInviteTemplate(appointment, e.target.value));
                    }}
                    className="flex-1 text-sm font-light text-[#1a73e8] bg-transparent focus:outline-none"
                  />
                </div>
                <button
                  onClick={copyLink}
                  title="Copy link"
                  className="px-3 border border-black/10 border-r-0 hover:bg-black/5 transition text-black/40 hover:text-black"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={regenerateLink}
                  title="Generate new link"
                  className="px-3 border border-black/10 border-r-0 hover:bg-black/5 transition text-black/40 hover:text-black"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <a
                  href={meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Open in browser"
                  className="px-3 border border-black/10 hover:bg-black/5 transition text-black/40 hover:text-black flex items-center"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
              <p className="text-[9px] text-black/30 mt-1.5">
                Auto-generated link. You can edit it or paste one from Google Calendar.
              </p>
            </div>

            {/* Session details */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                  Scheduled Date
                </label>
                <div className="px-3 py-2 border border-black/10 bg-black/2">
                  <p className="text-xs text-black/60 font-light">
                    {new Date(appointment.scheduledAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-[9px] uppercase tracking-widest text-black/40 mb-1.5">
                  Service
                </label>
                <div className="px-3 py-2 border border-black/10 bg-black/2">
                  <p className="text-xs text-black/60 font-light">{appointment.service}</p>
                </div>
              </div>
            </div>

            {/* Message body */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[9px] uppercase tracking-widest text-black/40">
                  Invite Message
                </label>
                <button
                  type="button"
                  onClick={regenerateLink}
                  className="flex items-center gap-1 text-[9px] uppercase tracking-widest text-black/40 hover:text-black transition"
                >
                  <RefreshCw className="w-2.5 h-2.5" />
                  Reset template
                </button>
              </div>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                className="w-full px-3 py-2.5 border border-black/10 text-sm font-light leading-relaxed focus:outline-none focus:border-black transition resize-none"
              />
              <p className="text-[9px] text-black/30 mt-1 text-right">{body.length} characters</p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 px-6 py-4 border-t border-black/10 shrink-0">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 border border-black/10 text-sm text-black/60 hover:border-black transition"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={scheduleMeeting.isPending || !meetLink.trim() || !body.trim()}
              className="flex-1 py-2.5 bg-[#1a73e8] text-white text-sm hover:bg-[#1557b0] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {scheduleMeeting.isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ScheduleMeetingModal;
