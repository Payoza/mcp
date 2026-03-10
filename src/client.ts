/**
 * Payoza API client wrapper.
 * Handles authentication, headers, and response parsing for all API calls.
 */

export interface PayozaConfig {
  apiUrl: string;
  apiToken: string;
  teamId: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: {
    page: number;
    per_page: number;
    total: number;
  };
  error?: {
    code: string;
    message: string;
  };
}

export class PayozaApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = "PayozaApiError";
  }
}

export class PayozaClient {
  private baseUrl: string;
  private token: string;
  private teamId: string;

  constructor(config: PayozaConfig) {
    this.baseUrl = config.apiUrl.replace(/\/+$/, "");
    this.token = config.apiToken;
    this.teamId = config.teamId;
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.token}`,
      "X-Team-ID": this.teamId,
      "Content-Type": "application/json",
    };
  }

  async request<T = unknown>(
    method: string,
    path: string,
    body?: unknown,
    query?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${path}`;

    if (query) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(query)) {
        if (v !== undefined && v !== "") params.set(k, v);
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const init: RequestInit = {
      method,
      headers: this.headers(),
    };

    if (body && method !== "GET") {
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);
    const json = (await res.json()) as ApiResponse<T>;

    if (!json.success) {
      throw new PayozaApiError(
        json.error?.code ?? "UNKNOWN",
        json.error?.message ?? "Unknown API error",
        res.status
      );
    }

    return json;
  }

  // Convenience methods
  async get<T = unknown>(
    path: string,
    query?: Record<string, string>
  ): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path, undefined, query);
  }

  async post<T = unknown>(
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, body);
  }

  async patch<T = unknown>(
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", path, body);
  }

  async delete<T = unknown>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path);
  }

  /** Get current user info via /v1/auth/me (no X-Team-ID needed for auth) */
  async getMe(): Promise<ApiResponse> {
    const url = `${this.baseUrl}/v1/auth/me`;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
    });
    return (await res.json()) as ApiResponse;
  }
}
