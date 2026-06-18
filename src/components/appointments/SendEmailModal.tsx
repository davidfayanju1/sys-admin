import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Send, User, Calendar, Clock, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import type { Appointment } from "../../hooks/useAppointments";
import { useSendAppointmentEmail } from "../../hooks/useAppointments";

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

const formatDateTime = (dateStr: string) =>
  new Date(dateStr).toLocaleString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

const buildTemplate = (a: Appointment) => ({
  subject: `Your In-Studio Consultation — ${new Date(a.preferredDate).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}`,
  body: `Hi ${a.fullName.split(" ")[0]},

Your in-studio consultation with SYS Empire has been confirmed. Here are your details:

Date & Time: ${formatDateTime(a.preferredDate)}
Duration:    ${a.duration}
Format:      In-Studio
Location:    SYS Empire Studio, Lagos, Nigeria
${a.whatDoYouNeed ? `\nYour request: "${a.whatDoYouNeed}"\n` : ""}
Please arrive 5–10 minutes early. If you need to reschedule or have questions, simply reply to this email.

We look forward to seeing you.

Warm regards,
The SYS Empire Team`,
});

const SendEmailModal = ({ appointment, onClose }: Props) => {
  const tpl = buildTemplate(appointment);
  const [subject, setSubject] = useState(tpl.subject);
  const [body, setBody] = useState(tpl.body);

  const sendEmail = useSendAppointmentEmail();

  const handleSend = () => {
    if (!subject.trim() || !body.trim()) return;
    sendEmail.mutate(
      { id: appointment._id, subject, message: body },
      {
        onSuccess: () => {
          toast.success(`Email sent to ${appointment.email}`);
          onClose();
        },
        onError: () => {
          toast.error("Failed to send email. Please try again.");
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
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <Mail className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-light tracking-wide text-black">
                  Send Email
                </h3>
                <p className="text-[10px] text-black/40 mt-0.5">
                  In-Studio Consultation
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-black/5 transition text-black/40"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Client summary strip */}
          <div className="px-6 py-3 bg-black/2 border-b border-black/5 flex flex-wrap gap-4 shrink-0">
            <div className="flex items-center gap-1.5">
              <User className="w-3 h-3 text-black/30" />
              <span className="text-[11px] text-black/60 font-light">
                {appointment.fullName}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3 text-black/30" />
              <span className="text-[11px] text-black/60 font-light">
                {appointment.email}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-black/30" />
              <span className="text-[11px] text-black/60 font-light">
                {new Date(appointment.preferredDate).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-black/30" />
              <span className="text-[11px] text-black/60 font-light">
                {appointment.duration}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* To */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.15em] text-black/40 mb-1.5">
                To
              </label>
              <div className="flex items-center gap-2 px-3 py-2 border border-black/10 bg-black/2">
                <Mail className="w-3.5 h-3.5 text-black/25 shrink-0" />
                <span className="text-sm text-black/50 font-light">
                  {appointment.email}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-[9px] uppercase tracking-[0.15em] text-black/40 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-black/10 text-sm font-light focus:outline-none focus:border-black transition"
              />
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-[9px] uppercase tracking-[0.15em] text-black/40">
                  Message
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const fresh = buildTemplate(appointment);
                    setSubject(fresh.subject);
                    setBody(fresh.body);
                  }}
                  className="flex items-center gap-1 text-[9px] uppercase tracking-[0.1em] text-black/40 hover:text-black transition"
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
              <p className="text-[9px] text-black/30 mt-1 text-right">
                {body.length} characters
              </p>
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
              disabled={sendEmail.isPending || !subject.trim() || !body.trim()}
              className="flex-1 py-2.5 bg-black text-white text-sm hover:bg-black/80 transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sendEmail.isPending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Sending…
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Send Email
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SendEmailModal;
