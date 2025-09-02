export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SetScoreRequest {
  userIdExterno: string;
  tournamentEditionId: number;
  points: number;
  playTime: number;
  countryCode: string;
  timezone: string;
}

export interface SetScoreResponse {
  success: boolean;
  scoreId?: number;
  position?: number;
  message?: string;
}

export interface GetScoresRequest {
  tournamentEditionId: number;
  limit?: number;
  offset?: number;
  userId?: string;
}

export interface ScoreWithRanking {
  id: number;
  userIdExterno: string;
  points: number;
  playTime: number;
  position: number;
  country: {
    code: string;
    name: string;
  };
  createdAt: Date;
}

export interface GetScoresResponse {
  success: boolean;
  data?: {
    scores: ScoreWithRanking[];
    totalParticipants: number;
    hasMore: boolean;
  };
  error?: string;
}

export interface ScoreValidation {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export const TournamentRegionType = {
  GLOBAL: "GLOBAL",
  REGIONAL: "REGIONAL",
} as const;

export const TournamentStatus = {
  ACTIVE: "ACTIVE",
  FINISHED: "FINISHED",
  CANCELLED: "CANCELLED",
} as const;

export type CreateTournamentEdition = {
  name: string;
  startDate: Date;
  endDate: Date;
  timezone: string;
  regionType: keyof typeof TournamentRegionType;
  scoreCriteriaId: number;
};

export type ScoreCriteria = {
  type: "points_time";
  pointsOrder: "desc" | "asc";
  timeOrder: "desc" | "asc";
};

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public validationErrors: string[]) {
    super(message, 400, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

export class DuplicateScoreError extends ApiError {
  constructor(message: string = "Ya existe un puntaje para este usuario hoy") {
    super(message, 409, "DUPLICATE_SCORE");
    this.name = "DuplicateScoreError";
  }
}

export class TournamentClosedError extends ApiError {
  constructor(message: string = "El torneo ha finalizado") {
    super(message, 410, "TOURNAMENT_CLOSED");
    this.name = "TournamentClosedError";
  }
}

export class RegionValidationError extends ApiError {
  constructor(message: string = "País no permitido en esta región") {
    super(message, 403, "REGION_NOT_ALLOWED");
    this.name = "RegionValidationError";
  }
}
