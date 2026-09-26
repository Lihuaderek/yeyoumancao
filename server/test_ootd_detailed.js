import { Client, handle_file } from '@gradio/client';
import fs from 'fs';

async function testOOTD() {
  try {
    const c = await Client.connect('levihsu/OOTDiffusion');
    console.log('Connected to OOTDiffusion, submitting test...');
    const imgBuf = fs.readFileSync('D:/web/yeyoumancao/public/images/dress1.jpg');
    const blob = new Blob([imgBuf], { type: 'image/jpeg' });
    const hfBlob = handle_file(blob);
    
    // OOTDiffusion takes array of parameters or named parameters
    const result = await c.predict('/process_dc', [
      hfBlob, // vton_img (model)
      hfBlob, // garm_img (garment)
      'Dress', // category
      1, // n_samples
      20, // n_steps
      2, // image_scale
      -1 // seed
    ]);
    console.log('OOTD Success result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.log('OOTD Detailed error:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
  }
}
testOOTD();
