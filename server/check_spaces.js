import { Client, handle_file } from '@gradio/client';

async function checkSpaces() {
  const spaces = ['yisol/IDM-VTON', 'levihsu/OOTDiffusion', 'zhengchong/CatVTON'];
  for (const s of spaces) {
    try {
      console.log('Connecting to ' + s + '...');
      const c = await Client.connect(s);
      const api = await c.view_api();
      console.log('SUCCESS for ' + s + ', endpoints:', Object.keys(api.named_endpoints || {}));
    } catch (e) {
      console.log('FAIL for ' + s + ':', e.message || e);
    }
  }
}
checkSpaces();
