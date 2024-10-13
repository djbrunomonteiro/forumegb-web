declare module 'audio-encoder' {
    export function encode(audioBuffer: AudioBuffer, options: {
      channels: number;
      sampleRate: number;
      bitRate?: number;
    }): Promise<Uint8Array>;
  }