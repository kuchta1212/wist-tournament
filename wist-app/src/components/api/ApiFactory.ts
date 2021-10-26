import { IApi } from "./IApi";
import { Api } from "./Api";

export function getApi(): IApi {
    return new Api();
}
