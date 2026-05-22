import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { ENV } from "./_core/env";

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
        const statusLabels = {
          yes: "Confirmou presença ✅",
          no: "Recusou presença ❌",
          maybe: "Talvez compareça 🤷‍♂️",
        };
        
        const message = `🎉 *Nova resposta ao convite!*\n\n*Nome:* ${input.fullName}\n*Status:* ${statusLabels[input.confirmationStatus]}\n*Acompanhantes:* ${input.numberOfCompanions}`;
        
        if (ENV.telegramBotToken && ENV.telegramChatId) {
          try {
            const res = await fetch(`https://api.telegram.org/bot${ENV.telegramBotToken}/sendMessage`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: ENV.telegramChatId,
                text: message,
                parse_mode: "Markdown"
              })
            });
            
            if (!res.ok) {
              console.error("Telegram API Error:", await res.text());
            }
          } catch (e) {
            console.error("Failed to send Telegram message", e);
          }
        } else {
          console.warn("Telegram credentials not configured. Skipping notification.");
        }
        
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
