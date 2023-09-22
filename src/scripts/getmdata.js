//@ts-nocheck
import fs from 'fs/promises';
import AWS from 'aws-sdk';
let link = "https://tnris-droc.s3.amazonaws.com/iswp/2022/cache.json";

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

    await fs.writeFile("~/", JSON.stringify(tableobj));
    console.log("Wait");   
}

runthis();