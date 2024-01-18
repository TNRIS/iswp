// @ts-nocheck
import { startDb17 } from "./db17";
import { startDb22 } from "./db22";
import { startDb27 } from "./db27";

export async function start_all_db() {
    let db = await Promise.all([startDb17(), startDb22(), startDb27()]);
    return db;
}
