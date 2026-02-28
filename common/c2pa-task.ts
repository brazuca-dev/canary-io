import { C2PA_INJECTION_QUEUE, redis } from "./redis-client.ts";

export interface C2PATask {
  assetId: string;
  status: "pending";
  attempts: number;
  last_attempt: number | null; // timestamp
}

export const createC2PATask = (assetId: string): C2PATask => ({
  assetId,
  status: "pending",
  attempts: 0,
  last_attempt: null,
});

export const updateC2PATaskAttempts = (task: C2PATask): C2PATask => ({
  ...task,
  attempts: task.attempts++,
  last_attempt: Date.now(),
});

export const pushC2PATaskToQueue = async (task: C2PATask): Promise<void> => {
  const taskString = JSON.stringify(task);
  await redis.lpush(C2PA_INJECTION_QUEUE, taskString);
};

export const getNextC2PATaskFromQueue = async (): Promise<C2PATask | null> => {
  // BRPOP means blocking right pop. It returns [list_name, value]. '0' means wait indefinitely.
  const task = await redis.brpop(0, C2PA_INJECTION_QUEUE);

  if (!task) return null;
  const asset = JSON.parse(task?.[1]);

  return asset as C2PATask;
};
