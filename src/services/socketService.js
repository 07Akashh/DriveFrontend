import io from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.isConnecting = false;
  }

  connect(userId) {
    if (!userId) {
      console.warn("SocketService: No userId provided");
      return;
    }

    if (
      this.socket?.connected &&
      this.socket.io.opts.query?.userId === userId
    ) {
      return;
    }

    if (this.socket) {
      this.disconnect();
    }

    const socketUrl =
      process.env.REACT_APP_SOCKET_URL || "http://localhost:3000";

    this.socket = io(socketUrl, {
      query: { userId },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 20000,
    });

    this.socket.on("connect", () => {
      console.log("Socket connected:", this.socket.id);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocketId() {
    return this.socket?.id;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Upload file via socket with real-time progress tracking
   * @param {File} file - File to upload
   * @param {Function} onProgress - Progress callback (uploadedBytes, totalBytes, percent)
   * @returns {Promise} - Resolves with upload result
   */
  uploadFile(file, onProgress) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error("Socket not connected"));
        return;
      }

      const CHUNK_SIZE = 512 * 1024; // 512KB chunks for faster progress updates
      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
      const userId = this.socket.io.opts.query?.userId;

      let currentChunk = 0;
      let totalUploaded = 0;
      let isComplete = false;

      // Report initial progress
      if (onProgress) {
        onProgress(0, file.size, 0);
      }

      const cleanup = () => {
        this.socket.off("media:upload:chunk-received", handleChunkReceived);
        this.socket.off("media:upload:complete", handleComplete);
        this.socket.off("media:upload:error", handleError);
        this.socket.off("media:upload:acknowledged", handleAcknowledged);
      };

      const handleChunkReceived = (data) => {
        if (isComplete) return;

        // Update progress based on server acknowledgment
        totalUploaded = data.uploadedSize || currentChunk * CHUNK_SIZE;
        const percent = Math.min(
          Math.round((totalUploaded / file.size) * 100),
          99
        );

        if (onProgress) {
          onProgress(totalUploaded, file.size, percent);
        }

        // Send next chunk
        sendChunk();
      };

      const handleComplete = (data) => {
        isComplete = true;
        cleanup();

        if (onProgress) {
          onProgress(file.size, file.size, 100);
        }

        resolve(data);
      };

      const handleError = (data) => {
        isComplete = true;
        cleanup();
        reject(new Error(data.error || "Upload failed"));
      };

      const handleAcknowledged = () => {
        // Start sending chunks after server acknowledges
        sendChunk();
      };

      const sendChunk = () => {
        if (isComplete || currentChunk >= totalChunks) {
          if (currentChunk >= totalChunks && !isComplete) {
            // All chunks sent, signal end
            this.socket.emit("media:upload:end");
          }
          return;
        }

        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const blob = file.slice(start, end);

        const reader = new FileReader();
        reader.onload = () => {
          if (isComplete) return;

          this.socket.emit("media:upload:chunk", {
            chunk: reader.result,
            chunkIndex: currentChunk,
            totalChunks,
            chunkSize: end - start,
          });

          currentChunk++;
        };

        reader.onerror = () => {
          isComplete = true;
          cleanup();
          reject(new Error("Failed to read file"));
        };

        reader.readAsArrayBuffer(blob);
      };

      // Setup listeners
      this.socket.on("media:upload:chunk-received", handleChunkReceived);
      this.socket.on("media:upload:complete", handleComplete);
      this.socket.on("media:upload:error", handleError);
      this.socket.on("media:upload:acknowledged", handleAcknowledged);

      // Start upload
      this.socket.emit("media:upload:start", {
        filename: file.name,
        size: file.size,
        mimeType: file.type,
        userId: userId,
      });
    });
  }

  removeAllListeners() {
    if (this.socket) {
      this.socket.removeAllListeners("media:upload:acknowledged");
      this.socket.removeAllListeners("media:upload:chunk-received");
      this.socket.removeAllListeners("media:upload:complete");
      this.socket.removeAllListeners("media:upload:error");
      this.socket.removeAllListeners("media:processing:status");
    }
  }
}

const socketService = new SocketService();
export default socketService;
