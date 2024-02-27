// @ts-nocheck
import { startDb17 } from "./db17";
import { startDb22 } from "./db22";
import { startDb27 } from "./db27";

export async function start_all_db() {
    return await Promise.all([startDb17(), startDb22(), startDb27()]);
}

export async function start_db_2017() {
    return await startDb17();
}

export async function start_db_2022() {
    return await startDb22();
}

export async function start_db_2027() {
    return await startDb27();
}