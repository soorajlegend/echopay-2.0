import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const url =
    "https://eu-de.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization:
      "Bearer eyJraWQiOiIyMDI1MDEzMDA4NDQiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTgwMDBSNDJVIiwiaWQiOiJJQk1pZC02OTgwMDBSNDJVIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiYzg4MDA5OTctZDBjMS00ODE2LWFiMmItNjliMWZiNmFjZThjIiwiaWRlbnRpZmllciI6IjY5ODAwMFI0MlUiLCJnaXZlbl9uYW1lIjoiU3VyYWoiLCJmYW1pbHlfbmFtZSI6Ik11aGFtbWFkIiwibmFtZSI6IlN1cmFqIE11aGFtbWFkIiwiZW1haWwiOiJrdWRlZS5wYXlAZ21haWwuY29tIiwic3ViIjoia3VkZWUucGF5QGdtYWlsLmNvbSIsImF1dGhuIjp7InN1YiI6Imt1ZGVlLnBheUBnbWFpbC5jb20iLCJpYW1faWQiOiJJQk1pZC02OTgwMDBSNDJVIiwibmFtZSI6IlN1cmFqIE11aGFtbWFkIiwiZ2l2ZW5fbmFtZSI6IlN1cmFqIiwiZmFtaWx5X25hbWUiOiJNdWhhbW1hZCIsImVtYWlsIjoia3VkZWUucGF5QGdtYWlsLmNvbSJ9LCJhY2NvdW50Ijp7InZhbGlkIjp0cnVlLCJic3MiOiIwZjg4MTkxNTM4MjY0MTU2YjdiZDhlYmU0YTA2YzlkNCIsImZyb3plbiI6dHJ1ZX0sImlhdCI6MTc0MDI0NDUzNywiZXhwIjoxNzQwMjQ4MTM3LCJpc3MiOiJodHRwczovL2lhbS5jbG91ZC5pYm0uY29tL2lkZW50aXR5IiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.VWACLKwmNsSj7uxZ3I54MpjiVz0RiwY9PLjgp0nbf6BA_qLkem2hSWA_LNWl1cOSg-es4Tx4w5lZeBJejTxLLc7LBuwPMFwHG2JNn9rutCX6wC9sjbIKYeYLX-1cY1PjRc4DSKx14FLO0kyzDYqtOpk7CzqRiGIif2iRrIwunxhJjF6NWaIYwiCwQnkhu3d1Fb86D8mqMQtWhlRavUc3H09WLLV2jtRce0m4uzX6VgYVOivr-J_a4uSVQ-E33LqVWUOi--sWuuOSgvfaNkHpuoMhlcU8yV5H7l4ZNmH5MzyqnLkxZr3xIaEbQ2BzLIf0kUitOGUMy7Xe4PVMLIiyTw",
  };
  const body = {
    input:
      "<|start_of_role|>system<|end_of_role|>You'''re a helpful ai assistant<|end_of_text|>\n<|start_of_role|>assistant<|end_of_role|>",
    parameters: {
      decoding_method: "greedy",
      max_new_tokens: 900,
      min_new_tokens: 0,
      stop_sequences: [],
      repetition_penalty: 1,
    },
    model_id: "ibm/granite-3-8b-instruct",
    project_id: "8aebcd3d-c673-483e-9780-b07d9d87cd03",
  };

  try {
    const response = await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Non-200 response");
    }

    console.log(response);

    return NextResponse.json(response.json());
  } catch (error) {
    console.error("Error in Granite API route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
