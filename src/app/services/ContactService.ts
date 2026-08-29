import axios from "axios";
import { serverApi } from "../../lib/config";
import { ContactMessageInput } from "../../lib/types/contact";

class ContactService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async submitMessage(input: ContactMessageInput): Promise<void> {
    try {
      const url = `${this.path}/contact/submit`;
      const result = await axios.post(url, input);
      console.log("submitMessage:", result);
    } catch (err) {
      console.log("Error, submitMessage:", err);
      throw err;
    }
  }
}

export default ContactService;
