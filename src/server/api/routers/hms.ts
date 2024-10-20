import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import axios from "axios";

// Define types for RoomData and RoomCode if needed
interface RoomCode {
  code: string;
  role: string;
  enabled: boolean;
}

export const hmsRouter = createTRPCRouter({
  // Procedure to create a room
  createRoom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        role: z.string(), // Added `role` to the input schema
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }

      const { name, role } = input; // Destructure `role` from input
      const token = process.env.HMS_MANAGEMENT_TOKEN;

      try {
        // Step 1: Create Room with 100ms API
        const response = await axios.post(
          `https://api.100ms.live/v2/rooms`,
          {
            name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const roomId: string = response.data.id;

        // Step 2: Fetch Room Details
        const roomData = await axios.get(
          `https://api.100ms.live/v2/rooms/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const roomDetails = roomData.data;

        // Step 3: Generate Room Code using the specified `role`
        const roomCode = await createRoomCode(roomDetails.id, role);

        return {
          roomDetails,
          roomCode,
        };
      } catch (error: any) {
        console.error(
          "Error creating room:",
          error?.response?.data || error.message,
        );
        throw new Error("Failed to create room");
      }
    }),
  joinRoom: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        role: z.string(), // Added `role` to the input schema
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const session = ctx.session;
      if (!session || !session.user) {
        throw new Error("Unauthorized");
      }

      const { name, role } = input; // Destructure `role` from input
      const token = process.env.HMS_MANAGEMENT_TOKEN;

      try {
        // Step 1: Create Room with 100ms API
        const response = await axios.post(
          `https://api.100ms.live/v2/rooms`,
          {
            name,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const roomId: string = response.data.id;

        // Step 2: Fetch Room Details
        const roomData = await axios.get(
          `https://api.100ms.live/v2/rooms/${roomId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const roomDetails = roomData.data;

        // Step 3: Generate Room Code using the specified `role`
        const roomCode = await createRoomCode(roomDetails.id, role);

        return {
          roomDetails,
          roomCode,
        };
      } catch (error: any) {
        console.error(
          "Error creating room:",
          error?.response?.data || error.message,
        );
        throw new Error("Failed to create room");
      }
    }),
});

// Helper function to create room codes with role
async function createRoomCode(
  roomId: string,
  role: string,
): Promise<RoomCode[]> {
  const token = process.env.HMS_MANAGEMENT_TOKEN;

  try {
    const response = await axios.post(
      `https://api.100ms.live/v2/room-codes/room/${roomId}`,
      {
        role, // Use the role parameter in the request
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    console.error(
      "Error generating room code:",
      error?.response?.data || error.message,
    );
    throw new Error("Failed to create room code");
  }
}
