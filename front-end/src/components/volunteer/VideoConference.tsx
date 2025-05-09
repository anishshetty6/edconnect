"use client";

import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface VideoConferenceProps {
  roomID: string;
}

const VideoConference = ({ roomID }: VideoConferenceProps) => {
  const videoContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Load ZegoCloud SDK
    const loadZegoSDK = async () => {
      try {
        // Check if ZegoUIKitPrebuilt is already defined
        if (!(window as any).ZegoUIKitPrebuilt) {
          // Load the ZegoCloud SDK script
          const script = document.createElement("script");
          script.src =
            "https://unpkg.com/@zegocloud/zego-uikit-prebuilt/zego-uikit-prebuilt.js";
          script.async = true;
          document.body.appendChild(script);

          // Wait for script to load
          await new Promise<void>((resolve) => {
            script.onload = () => resolve();
          });
        }

        // Initialize ZegoCloud once the script is loaded
        if (videoContainerRef.current && (window as any).ZegoUIKitPrebuilt) {
          const { ZegoUIKitPrebuilt } = window as any;

          // Get app ID and server secret from environment variables
          const appID = Number(import.meta.env.VITE_ZEGO_APP_ID || 0);
          const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET || "";

          if (!appID || !serverSecret) {
            console.error("ZegoCloud credentials not found");
            return;
          }

          // Generate a Kit Token
          const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            appID,
            serverSecret,
            `meeting-${roomID}`,
            Date.now().toString(),
            `User_${Math.floor(Math.random() * 1000)}`
          );

          // Create instance
          const zp = ZegoUIKitPrebuilt.create(kitToken);

          // Join room
          zp.joinRoom({
            container: videoContainerRef.current,
            sharedLinks: [
              {
                name: "Copy Link",
                url: `${window.location.origin}/volunteer/meet/${roomID}`,
              },
            ],
            scenario: {
              mode: ZegoUIKitPrebuilt.VideoConference,
            },
            showPreJoinView: true,
            showScreenSharingButton: true,
            showUserList: true,
            showLayoutButton: true,
            showPinButton: true,
            turnOnMicrophoneWhenJoining: true,
            turnOnCameraWhenJoining: true,
            showLeavingView: true,
            showRoomDetailsButton: true,
            maxUsers: 50,
            layout: "Grid",
            onLeaveRoom: () => {
              navigate("/volunteer/calendar");
            },
          });
        }
      } catch (error) {
        console.error("Error initializing ZegoCloud:", error);
      }
    };

    // Get camera and microphone permissions
    const getPermissions = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        console.log("Permissions granted");
        await loadZegoSDK();
      } catch (err) {
        console.error("Permission denied:", err);
      }
    };

    getPermissions();

    return () => {
      // Cleanup
    };
  }, [roomID, navigate]);

  if (!roomID) {
    return <div className="p-4">Invalid Room ID</div>;
  }

  return (
    <div className="h-screen w-full">
      <div ref={videoContainerRef} className="w-full h-full" />
    </div>
  );
};

export default VideoConference;
