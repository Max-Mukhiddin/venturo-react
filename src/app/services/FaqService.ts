import axios from "axios";
import { serverApi } from "../../lib/config";
import { FAQ } from "../../lib/types/faq";
export default class FaqService { public async getFaqs(): Promise<FAQ[]> { const result = await axios.get(`${serverApi}/faq/all`); return result.data; } }
