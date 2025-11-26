import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { vcfoAPI } from "@/integrations/mongodb/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface VcfoMessage {
  id: string;
  role: string;
  content: string;
  image_url?: string | null;
  secondary_image_url?: string | null;
  meta?: Record<string, unknown> | null;
  createdAt?: string;
}

export interface VcfoUpload {
  id: string;
  originalName: string;
  storedPath?: string | null;
  size?: number | null;
  mimeType?: string | null;
  uploadedAt?: string;
}

interface VcfoContextValue {
  messages: VcfoMessage[];
  uploads: VcfoUpload[];
  loading: boolean;
  refreshVcfoData: () => Promise<void>;
  addMessage: (message: Omit<VcfoMessage, "id">) => Promise<VcfoMessage | null>;
  recordUpload: (upload: Omit<VcfoUpload, "id">) => Promise<VcfoUpload | null>;
}

const VcfoContext = createContext<VcfoContextValue | undefined>(undefined);

const sortByDate = <T extends { createdAt?: string; uploadedAt?: string }>(items: T[], key: "createdAt" | "uploadedAt") => {
  return [...items].sort((a, b) => {
    const left = a[key] ? new Date(a[key] as string).getTime() : 0;
    const right = b[key] ? new Date(b[key] as string).getTime() : 0;
    return left - right;
  });
};

export const VcfoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<VcfoMessage[]>([]);
  const [uploads, setUploads] = useState<VcfoUpload[]>([]);
  const [loading, setLoading] = useState(true);

  const resetState = useCallback(() => {
    setMessages([]);
    setUploads([]);
    setLoading(false);
  }, []);

  const refreshVcfoData = useCallback(async () => {
    if (!user) {
      resetState();
      return;
    }

    setLoading(true);
    try {
      const [fetchedMessages, fetchedUploads] = await Promise.all([
        vcfoAPI.getMessages(),
        vcfoAPI.getUploads(),
      ]);

      setMessages(sortByDate(fetchedMessages, "createdAt"));
      setUploads(sortByDate(fetchedUploads, "uploadedAt"));
    } catch (error) {
      console.error("Failed to load VCFO data:", error);
      toast.error("Unable to load VCFO history");
    } finally {
      setLoading(false);
    }
  }, [resetState, user]);

  useEffect(() => {
    refreshVcfoData();
  }, [refreshVcfoData]);

  const addMessage = useCallback(
    async (message: Omit<VcfoMessage, "id">) => {
      if (!user) {
        toast.error("You need to be logged in to use the VCFO assistant");
        return null;
      }

      try {
        const saved = await vcfoAPI.saveMessage({
          role: message.role,
          content: message.content,
          image_url: message.image_url || null,
          secondary_image_url: message.secondary_image_url || null,
          meta: message.meta || null,
        });
        setMessages((prev) => sortByDate([...prev, saved], "createdAt"));
        return saved;
      } catch (error) {
        console.error("Failed to save VCFO message:", error);
        toast.error("Unable to store conversation. Please try again.");
        return null;
      }
    },
    [user]
  );

  const recordUpload = useCallback(
    async (upload: Omit<VcfoUpload, "id">) => {
      if (!user) {
        toast.error("You need to be logged in to use the VCFO assistant");
        return null;
      }

      try {
        const saved = await vcfoAPI.saveUpload({
          originalName: upload.originalName,
          storedPath: upload.storedPath || null,
          size: upload.size ?? null,
          mimeType: upload.mimeType || null,
        });
        setUploads((prev) => sortByDate([...prev, saved], "uploadedAt"));
        return saved;
      } catch (error) {
        console.error("Failed to store VCFO upload metadata:", error);
        toast.error("Unable to store upload metadata.");
        return null;
      }
    },
    [user]
  );

  const value = useMemo(
    () => ({
      messages,
      uploads,
      loading,
      refreshVcfoData,
      addMessage,
      recordUpload,
    }),
    [messages, uploads, loading, refreshVcfoData, addMessage, recordUpload]
  );

  return <VcfoContext.Provider value={value}>{children}</VcfoContext.Provider>;
};

export const useVcfo = () => {
  const context = useContext(VcfoContext);
  if (!context) {
    throw new Error("useVcfo must be used within a VcfoProvider");
  }
  return context;
};


