// const UID = Math.floor(Math.random() * 232) + 1;

import {
  AGORA_APP_ID,
  AWS_ACCESS_KEY,
  AWS_BUCKET_NAME,
  AWS_SECRET_KEY,
  CUSTOMER_ID,
  CUSTOMER_SECRET,
} from "./const";

export const makeRequest = async (
  method: string,
  url: string,
  credential: string,
  body?: string
) => {
  const headers = new Headers({
    Authorization: "Basic " + credential,
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": `${method}, OPTIONS`,
  });

  const res = await fetch(url, {
    method: method,
    headers: headers,
    body: body,
  });
  if (!res.ok) {
    console.log(await res.text());
    throw new Error("Failed to make request");
  }

  return res;
};

export const generateCredential = (): string => {
  const credential = `${CUSTOMER_ID}:${CUSTOMER_SECRET}`;
  return btoa(credential);
};

export const generateSpeechToTextResource = async (
  channel: string,
  credential: string
): Promise<string> => {
  const body = {
    instanceId: channel,
  };
  const url = `https://api.agora.io/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/builderTokens`;
  const res = await makeRequest("POST", url, credential, JSON.stringify(body));
  const data = await res.json();
  return data.tokenName;
};

export const startTranscription = async (
  channel: string,
  credential: string
): Promise<[string, string]> => {
  const tokenName = await generateSpeechToTextResource(channel, credential);
  const url = `https://api.agora.io/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/tasks?builderToken=${tokenName}`;

  const payload = {
    audio: {
      subscribeSource: "AGORARTC",
      agoraRtcConfig: {
        channelName: channel,
        uid: "100",
        channelType: "LIVE_TYPE",
        subscribeConfig: {
          subscribeMode: "CHANNEL_MODE",
        },
        maxIdleTime: 60,
      },
    },
    config: {
      features: ["RECOGNIZE"],
      recognizeConfig: {
        language: "en-US,es-ES",
        model: "Model",
        output: {
          destinations: ["AgoraRTCDataStream", "Storage"],
          agoraRTCDataStream: {
            channelName: channel,
            uid: "101",
          },
          cloudStorage: [
            {
              format: "HLS",
              storageConfig: {
                accessKey: AWS_ACCESS_KEY,
                secretKey: AWS_SECRET_KEY,
                bucket: AWS_BUCKET_NAME,
                vendor: 1,
                region: 2,
                fileNamePrefix: ["rtt"],
              },
            },
          ],
        },
      },
    },
  };

  const res = await makeRequest(
    "POST",
    url,
    credential,
    JSON.stringify(payload)
  );
  const data = await res.json();
  return [data.taskId, tokenName];
};

export const stopTranscription = async (
  taskId: string,
  builderToken: string,
  credential: string
) => {
  const url = `https://api.agora.io/v1/projects/${AGORA_APP_ID}/rtsc/speech-to-text/tasks/${taskId}?builderToken=${builderToken}`;

  await makeRequest("DELETE", url, credential, "");

  return { message: "stopped" };
};

// export const generateCloudRecordingResource = async (
//   channel: string,
//   credential: string
// ): Promise<string> => {
//   const payload = {
//     cname: channel,
//     uid: UID.toString(),
//     clientRequest: {},
//   };

//   const url = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/acquire`;
//   const res = await makeRequest(
//     "POST",
//     url,
//     credential,
//     JSON.stringify(payload)
//   );
//   const data = await res.json();
//   return data.resourceId;
// };

// export const startCloudRecording = async (
//   channel: string,
//   credential: string
// ): Promise<[string, string]> => {
//   const resourceId = await generateCloudRecordingResource(channel, credential);
//   const url = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/mode/mix/start`;

//   const payload = {
//     cname: channel,
//     uid: UID.toString(),
//     clientRequest: {
//       recordingConfig: {
//         maxIdleTime: 3,
//       },
//       storageConfig: {
//         secretKey: SECRET_KEY,
//         vendor: 1,
//         region: 1,
//         bucket: BUCKET_NAME,
//         accessKey: ACCESS_KEY,
//         fileNamePrefix: ["agora"],
//       },
//       recordingFileConfig: {
//         avFileType: ["hls", "mp4"],
//       },
//     },
//   };

//   const res = await makeRequest(
//     "POST",
//     url,
//     credential,
//     JSON.stringify(payload)
//   );
//   const data = await res.json();
//   return [resourceId, data.sid];
// };

// export const stopCloudRecording = async (
//   channel: string,
//   resourceId: string,
//   sid: string,
//   credential: string
// ): Promise<{
//   resource_id: string;
//   sid: string;
//   server_response: any;
//   mp4_link: string;
//   m3u8_link: string;
// }> => {
//   const url = `https://api.agora.io/v1/apps/${AGORA_APP_ID}/cloud_recording/resourceid/${resourceId}/sid/${sid}/mode/mix/stop`;

//   const payload = {
//     cname: channel,
//     uid: UID.toString(),
//     clientRequest: {},
//   };

//   const res = await makeRequest(
//     "POST",
//     url,
//     credential,
//     JSON.stringify(payload)
//   );
//   const data = await res.json();

//   return {
//     resource_id: data.resourceId,
//     sid: data.sid,
//     server_response: data.serverResponse,
//     mp4_link: data.serverResponse.fileList[0].fileName,
//     m3u8_link: data.serverResponse.fileList[1].fileName,
//   };
// };
