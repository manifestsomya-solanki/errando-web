import { Request } from "../models/customer/requestlist";

export function isCompletedRequest(request: Pick<Request, "status" | "is_closed">): boolean {
  const status = String(request.status ?? "").toUpperCase();
  if (status === "COMPLETED") return true;
  const closed = request.is_closed;
  return closed === 1 || closed === "1";
}

export function isPendingRequest(request: Pick<Request, "status" | "is_closed">): boolean {
  return !isCompletedRequest(request);
}
