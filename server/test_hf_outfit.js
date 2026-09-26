import { Client, handle_file } from "@gradio/client";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testOutfitAnyone() {
    try {
        console.log(`Connecting to HumanAIGC/OutfitAnyone...`);
        const client = await Client.connect("HumanAIGC/OutfitAnyone");
        
        console.log(`Predicting...`);
        const userImg = path.resolve(__dirname, '../public/images/model_male.jpg');
        const garmImg = path.resolve(__dirname, '../public/images/garment_men_1.jpg');
        
        const result = await client.predict("/get_tryon_result", {
            model_name: handle_file(userImg),
            garment1: handle_file(garmImg),
            garment2: null,
        });
        
        console.log(`Success! Result:`, JSON.stringify(result.data, null, 2));
    } catch (e) {
        console.error(`Failed:`, e.message);
    }
}

testOutfitAnyone();
