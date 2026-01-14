import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { sendFacebookEvent } from "./_core/facebookCAPI";
import { getSafeIPForCAPI } from "./_core/ipUtils";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
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

  // Facebook Conversions API (CAPI) - Server-Side Tracking
  facebook: router({
    trackEvent: publicProcedure
      .input(z.object({
        eventName: z.enum(['PageView', 'ViewContent', 'InitiateCheckout', 'Purchase']),
        eventSourceUrl: z.string(),
        fbp: z.string().optional(), // _fbp cookie
        fbc: z.string().optional(), // _fbc cookie
        customData: z.object({
          content_name: z.string().optional(),
          content_type: z.string().optional(),
          currency: z.string().optional(),
          value: z.number().optional(),
          num_items: z.number().optional(),
        }).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        console.log('[tRPC] Facebook trackEvent called:', {
          eventName: input.eventName,
          url: input.eventSourceUrl,
          fbp: input.fbp,
          fbc: input.fbc,
          customData: input.customData
        });

        const userAgent = ctx.req.headers['user-agent'] || 'Mozilla/5.0 (compatible)';
        const ipAddress = getSafeIPForCAPI(ctx.req.headers, ctx.req.socket.remoteAddress);

        console.log('[tRPC] Extracted headers:', { userAgent, ipAddress });

        const success = await sendFacebookEvent({
          eventName: input.eventName,
          eventSourceUrl: input.eventSourceUrl,
          userAgent,
          ipAddress,
          fbp: input.fbp,
          fbc: input.fbc,
          customData: input.customData,
        });

        console.log('[tRPC] CAPI result:', { success });
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
