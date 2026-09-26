import { Client, handle_file } from '@gradio/client';
import fs from 'fs';

async function testIDM() {
  try {
    const c = await Client.connect('yisol/IDM-VTON');
    console.log('Connected to IDM-VTON, submitting test...');
    // test with a simple blob
    const imgBuf = fs.readFileSync('D:/web/yeyoumancao/public/images/dress1.jpg');
    const blob = new Blob([imgBuf], { type: 'image/jpeg' });
    const hfBlob = handle_file(blob);
    
    const result = await c.predict('/tryon', {
      dict: { background: hfBlob, layers: [], composite: null },
      garm_img: hfBlob,
      garment_des: 'traditional Chinese dress',
      is_checked: true,
      is_checked_crop: false,
      denoise_steps: 20,
      seed: 42
    });
    console.log('Success result:', result);
  } catch (err) {
    console.log('Detailed error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
  }
}
testIDM();
