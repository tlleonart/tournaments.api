import { db } from "@itbaf/tournaments-models";
import { z } from "zod";
import functions from '@google-cloud/functions-framework';
import type { Request, Response } from '@google-cloud/functions-framework';

const QueryDto = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(200).default(20),
  countryId: z.coerce.number().int().positive().optional(),
  tournamentEditionId: z.coerce.number().int().positive().optional(),
  userId: z.string().min(1).optional()
});

export async function getScores(req: Request, res: Response) {
    try {
        const parsed = QueryDto.safeParse(req.query);
        if (!parsed.success) {
            return res.status(400).json({ error: parsed.error.flatten() });
        }
        const { page, pageSize, countryId, tournamentEditionId, userId } = parsed.data;

        const where: any = {};
        if (countryId) where.countryId = countryId;
        if (tournamentEditionId) where.tournamentEditionId = tournamentEditionId;
        if (userId) where.userId = userId;

        const [items, total] = await Promise.all([
            db().score.findMany({
                where,
                skip: (page - 1) * pageSize,
                take: pageSize,
                orderBy: [{ amount: "desc" }, { playTime: "asc" }],
                include: {
                    country: true,
                    edition: { include: { scoreCriteria: true, tournaments: true } },
                }
            }),
            db().score.count({ where })
        ]);

        return res.json({ items, total, page, pageSize });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ error: "internal_error", detail: err?.message });
    }
}

// Register for Cloud Functions/Cloud Run using Functions Framework
functions.http('get-scores', getScores);