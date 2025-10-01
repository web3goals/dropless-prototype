import { ApiResponse, ApiResponseError } from "@/types/api";
import { NextResponse } from "next/server";

export function createSuccessApiResponse<T>(data?: T) {
  const response: ApiResponse<T> = { success: true, data };
  return NextResponse.json(response, { status: 200 });
}

export function createFailedApiResponse<T>(
  error: ApiResponseError,
  status: number
) {
  const response: ApiResponse<T> = { success: false, error };
  return NextResponse.json(response, { status });
}
