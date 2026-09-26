import { Client } from "@gradio/client";

async function testSpace(spaceId) {
    try {
        console.log(`Testing ${spaceId}...`);
        const client = await Client.connect(spaceId);
        const appInfo = await client.view_api();
        console.log(`[${spaceId}] endpoints:`, Object.keys(appInfo.named_endpoints));
    } catch (e) {
        console.error(`[${spaceId}] Failed:`, e.message);
    }
}

async function run() {
    await testSpace("yisol/IDM-VTON");
    await testSpace("Kwai-Kolors/Kolors-Virtual-Try-On");
    await testSpace("Nymbo/Virtual-Try-On");
    await testSpace("levihsu/OOTDiffusion");
}

run();
