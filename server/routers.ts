import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createGuestConfirmation, getAllConfirmations, getConfirmationStats } from "./db";
import { notifyOwner } from "./_core/notification";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  confirmations: router({
    submit: publicProcedure
      .input(
        z.object({
          fullName: z.string().min(1, "Nome completo é obrigatório"),
          numberOfCompanions: z.number().int().min(0, "Número de acompanhantes não pode ser negativo"),
          confirmationStatus: z.enum(["yes", "no", "maybe"]),
        })
      )
      .mutation(async ({ input }) => {
        const confirmation = await createGuestConfirmation(input);
        
        // Notify owner of new confirmation
        const statusLabels = {
          yes: "Confirmou presença",
          no: "Recusou presença",
          maybe: "Talvez compareça",
        };
        
        await notifyOwner({
          title: `Nova confirmação de presença: ${input.fullName}`,
          content: `${input.fullName} ${statusLabels[input.confirmationStatus]}. Acompanhantes: ${input.numberOfCompanions}`,
        });
        
        return confirmation;
      }),
    
    list: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can see all confirmations
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getAllConfirmations();
    }),
    
    stats: protectedProcedure.query(async ({ ctx }) => {
      // Only admin can see stats
      if (ctx.user?.role !== "admin") {
        throw new Error("Unauthorized");
      }
      return await getConfirmationStats();
    }),
  }),
});

export type AppRouter = typeof appRouter;
