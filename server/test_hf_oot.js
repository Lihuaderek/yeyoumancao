import { Client, handle_file } from "@gradio/client";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testOOT() {
    try {
        console.log(`Connecting to levihsu/OOTDiffusion...`);
        const client = await Client.connect("levihsu/OOTDiffusion");
        
        console.log(`Predicting...`);
        const userImg = path.resolve(__dirname, '../public/images/tryon_men_1.jpg');
        const garmImg = path.resolve(__dirname, '../public/images/garment_men_1.jpg');
        
        const result = await client.predict("/process_dc", {
            vton_img: handle_file(userImg),
            garm_img: handle_file(garmImg),
            category: "Upper-body",
            n_samples: 1,
            n_steps: 20,
            image_scale: 2,
            seed: -1,
        });
        
        console.log(`Success! Result:`, JSON.stringify(result.data, null, 2));
    } catch (e) {
        console.error(`Failed:`, e.message);
    }
}

testOOT();
