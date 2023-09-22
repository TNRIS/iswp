//@ts-nocheck
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
let link = "https://tnris-droc.s3.amazonaws.com/iswp/2022/cache.json";
const client = new S3Client({});;

let runthis = async () => {
    let db23 = await fetch(link, {
        decompress: true,
    });
    let db23_json = await db23.json();

    let tableobj = [];
    for(let db in db23_json) {
        tableobj.push({
            name: db,
            length: db23_json[db].length
        });
    }


}

runthis();