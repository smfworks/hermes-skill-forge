import { NextRequest } from "next/server";
import { getSystemState, subscribeToState, startActivitySimulation, stopActivitySimulation } from "@/lib/mock-data";

// Start activity simulation when the server starts
let simulationStarted = false;

function startSimulation() {
  if (!simulationStarted) {
    startActivitySimulation(5000);
    simulationStarted = true;
  }
}

/**
 * GET /api/events/stream
 * Server-Sent Events endpoint for real-time system updates.
 */
export async function GET(request: NextRequest) {
  startSimulation();

  const stream = new ReadableStream({
    start(controller) {
      const send = (data: any) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Send initial state
      send({
        type: "init",
        data: getSystemState(),
      });

      // Subscribe to state changes
      const unsubscribe = subscribeToState((state) => {
        send({
          type: "update",
          data: state,
        });
      });

      // Send heartbeat every 15 seconds
      const heartbeat = setInterval(() => {
        send({ type: "heartbeat", timestamp: Date.now() });
      }, 15000);

      // Cleanup on disconnect
      request.signal.addEventListener("abort", () => {
        unsubscribe();
        clearInterval(heartbeat);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "Cache-Control",
    },
  });
}
