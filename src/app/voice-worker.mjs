// Kokoro runs here, off the page's main thread: making a sentence of speech takes from a fraction of a second to
// many seconds of steady computing, and on the main thread the page could not scroll, type or click meanwhile.
import { KokoroTTS } from 'kokoro-js';

let tts = null;
self.onmessage = async ({ data }) => {
  if (data.type === 'load') {
    try {
      tts = await KokoroTTS.from_pretrained(data.model, {
        dtype: 'q8', device: 'wasm',
        progress_callback: (e) => { if (e?.status === 'progress' && e.total) self.postMessage({ type: 'progress', file: e.file, loaded: e.loaded, total: e.total }); },
      });
      self.postMessage({ type: 'ready' });
    } catch (e) { self.postMessage({ type: 'failed', error: String(e?.message ?? e) }); }
  } else if (data.type === 'gen') {
    let blob = null;
    try { blob = (await tts.generate(data.text, { voice: data.voice })).toBlob(); } catch {}
    self.postMessage({ type: 'audio', id: data.id, blob });
  }
};
