import { Option } from "../option/option.js";

export interface Question {
  text: string;
  options: Option[];
}
