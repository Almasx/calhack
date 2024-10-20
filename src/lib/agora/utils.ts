import { AGORA_APP_CERTIFICATE, AGORA_APP_ID } from "./const";

const MODE = "test";
const gatewayAddress =
  MODE === "test"
    ? "https://service-staging.agora.io/speech-to-text"
    : "https://api.agora.io";

const BASE_URL = "https://service.agora.io/toolbox-overseas";

const SUB_BOT_UID = "1000";
const PUB_BOT_UID = "2000";

let agoraToken = "";
let genTokenTime = 0;

// ---------------------------------------
// Generate Agora Token
export async function apiGetAgoraToken(config: {
  uid: string | number;
  channel: string;
}): Promise<string | null> {
  if (!AGORA_APP_CERTIFICATE) return null;

  const { uid, channel } = config;
  const url = `${BASE_URL}/v2/token/generate`;
  const data = {
    appId: AGORA_APP_ID,
    appCertificate: AGORA_APP_CERTIFICATE,
    channelName: channel,
    expire: 7200,
    src: "web",
    types: [1, 2],
    uid: String(uid),
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  return result?.data?.token || null;
}

// ---------------------------------------
// Generate Authorization Header
const genAuthorization = async (config: {
  uid: string | number;
  channel: string;
}): Promise<string> => {
  const currentTime = Date.now();

  if (agoraToken && currentTime - genTokenTime < 1000 * 60 * 60) {
    return `agora token="${agoraToken}"`;
  }

  agoraToken = (await apiGetAgoraToken(config)) ?? "";
  genTokenTime = Date.now();
  return `agora token="${agoraToken}"`;
};

// ---------------------------------------
// Acquire STT Token
export const apiSTTAcquireToken = async (options: {
  channel: string;
  uid: string | number;
}): Promise<{ tokenName: string }> => {
  const { channel, uid } = options;
  const url = `${gatewayAddress}/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/builderTokens`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: await genAuthorization({ uid, channel }),
    },
    body: JSON.stringify({ instanceId: channel }),
  });

  if (response.status === 200) return response.json();

  console.error(`Error: ${response.status}`, response);
  throw new Error("Failed to acquire STT token");
};

// ---------------------------------------
// Start English Transcription
export const apiSTTStartTranscription = async (options: {
  uid: string | number;
  channel: string;
  token: string;
}): Promise<{ taskId: string }> => {
  const { uid, channel, token } = options;
  const url = `${gatewayAddress}/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/tasks?builderToken=${token}`;

  const [subBotToken, pubBotToken] = await Promise.all([
    apiGetAgoraToken({ uid: SUB_BOT_UID, channel }),
    apiGetAgoraToken({ uid: PUB_BOT_UID, channel }),
  ]);

  const body = {
    languages: ["en-US"], // Only English supported
    maxIdleTime: 60,
    rtcConfig: {
      channelName: channel,
      subBotUid: SUB_BOT_UID,
      pubBotUid: PUB_BOT_UID,
      subBotToken,
      pubBotToken,
    },
  };

  console.log(url);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: await genAuthorization({ uid, channel }),
    },
    body: JSON.stringify(body),
  });

  const result = await response.json();
  if (response.status !== 200)
    throw new Error(result.message || "Failed to start transcription");

  return result;
};

// ---------------------------------------
// Stop Transcription
export const apiSTTStopTranscription = async (options: {
  taskId: string;
  token: string;
  uid: string | number;
  channel: string;
}): Promise<void> => {
  const { taskId, token, uid, channel } = options;
  const url = `${gatewayAddress}/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/tasks/${taskId}?builderToken=${token}`;

  await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: await genAuthorization({ uid, channel }),
    },
  });
};

// ---------------------------------------
// Query Transcription Status
export const apiSTTQueryTranscription = async (options: {
  taskId: string;
  token: string;
  uid: string | number;
  channel: string;
}): Promise<unknown> => {
  const { taskId, token, uid, channel } = options;
  const url = `${gatewayAddress}/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/tasks/${taskId}?builderToken=${token}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: await genAuthorization({ uid, channel }),
    },
  });

  return response.json();
};

// ---------------------------------------
// Update Transcription Task
export const apiSTTUpdateTranscription = async (options: {
  taskId: string;
  token: string;
  uid: string | number;
  channel: string;
  updateMaskList: string[];
  data: Record<string, unknown>;
}): Promise<unknown> => {
  const { taskId, token, uid, channel, updateMaskList, data } = options;
  const updateMask = updateMaskList.join(",");
  const url = `${gatewayAddress}/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/tasks/${taskId}?builderToken=${token}&sequenceId=1&updateMask=${updateMask}`;

  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: await genAuthorization({ uid, channel }),
    },
    body: JSON.stringify(data),
  });

  return response.json();
};
