// @ts-nocheck
import { startDb17 } from "./db17";
import { startDb22 } from "./db22";

export async function start_all_db() {
    let db = await Promise.all([startDb17(), startDb22()]);
    return db;
}
