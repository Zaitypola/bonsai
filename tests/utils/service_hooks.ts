import {PORT} from "../../source/constants";
import {startService, stopService} from "../../source/http_service";
import {dropDB} from "./db";

export const serviceHooks = (): void => {
    beforeAll(async () => {
        await startService(PORT);
    })
    afterAll(stopService);
    beforeEach(dropDB);
    afterEach(dropDB);
};