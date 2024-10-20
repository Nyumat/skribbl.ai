import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
    createTRPCRouter,
    protectedProcedure
} from "~/server/api/trpc";

export const roomRouter = createTRPCRouter({
  create: protectedProcedure
    .mutation(async ({ ctx }) => {
      const existingRoom = await ctx.db.room.findUnique({
        where: { createdById: ctx.session.user.id },
      });

      if (existingRoom) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'User already has a room',
        });
      }

      const room = await ctx.db.room.create({
        data: {
          createdBy: { connect: { id: ctx.session.user.id } },
          players: { connect: { id: ctx.session.user.id } },
        },
      });

      return room;
    }),

  get: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .query(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { id: input.roomId },
        include: {
          players: true,
          createdBy: true,
        },
      });

      if (!room) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room not found',
        });
      }

      return room;
    }),

  join: protectedProcedure
    .input(z.object({ roomId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const room = await ctx.db.room.findUnique({
        where: { id: input.roomId },
        include: { players: true },
      });

      if (!room) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Room not found',
        });
      }

      const isAlreadyJoined = room.players.some(player => player.id === ctx.session.user.id);

      if (isAlreadyJoined) {
        return { alreadyJoined: true };
      }

      const updatedRoom = await ctx.db.room.update({
        where: { id: input.roomId },
        data: {
          players: { connect: { id: ctx.session.user.id } },
        },
        include: { players: true },
      });

      return { alreadyJoined: false, room: updatedRoom };
    }),

  getCreated: protectedProcedure.query(async ({ ctx }) => {
    const room = await ctx.db.room.findUnique({
      where: { createdById: ctx.session.user.id },
      include: {
        players: true,
        createdBy: true,
      },
    });

    return room;
  }),
});