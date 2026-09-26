import { getFirstAidResponse } from './src/services/firstAid.service';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    console.log('API KEY:', process.env.GEMINI_API_KEY ? 'Set' : 'Not Set');
    console.log('MODEL:', process.env.GEMINI_MODEL);
    const res = await getFirstAidResponse('fall');
    console.log('SOURCE:', res?.source);
    console.log('TIP:', res?.contextualTip);
}
test();
