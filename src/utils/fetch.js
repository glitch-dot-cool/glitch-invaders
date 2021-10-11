import { setBaseUrl } from "./setBaseUrl.js";

export class Fetch {
  static baseUrl = setBaseUrl();

  static async get(endpoint = "score") {
    try {
      const options = {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      };
      const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
      if (response.ok) {
        return response.json();
      } else throw "error fetching score";
    } catch (error) {
      return error;
    }
  }

  static async post(endpoint = "score", data) {
    try {
      const options = {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: data,
      };
      const response = await fetch(`${this.baseUrl}/${endpoint}`, options);
      if (response.ok) {
        return response.json();
      } else {
        throw "error submitting score";
      }
    } catch (error) {
      return error;
    }
  }
}
