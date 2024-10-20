export interface ITranslationItem {
  lang: string;
  text: string;
}

export interface ITextstream {
  dataType: "transcribe" | "translate";
  culture: string;
  uid: string | number;
  startTextTs: number;
  textTs: number;
  time: number;
  durationMs: number;
  words: any[];
  trans?: any[];
}

export interface ParserEvents {
  textstreamReceived: (textstream: ITextstream) => void;
}

import { AGEventEmitter } from "~/lib/events";
import protoRoot from "~/lib/protobuf/SttMessage_es6";

export class Parser extends AGEventEmitter<ParserEvents> {
  constructor() {
    super();
  }

  praseData(data: any) {
    const textstream = protoRoot.Agora.SpeechToText.lookup("Text").decode(
      data
    ) as ITextstream;
    if (!textstream) {
      return console.warn("Prase data failed.");
    }
    console.log("[test] textstream praseData", textstream);
    this.emit("textstreamReceived", textstream);
  }
}

export const parser = new Parser();
