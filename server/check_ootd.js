import { Client } from '@gradio/client';

async function checkOOTD() {
  try {
    const c = await Client.connect('levihsu/OOTDiffusion');
    const api = await c.view_api();
    console.log(JSON.stringify(api.named_endpoints, null, 2));
  } catch (e) {
    console.log(e);
  }
}
checkOOTD();
