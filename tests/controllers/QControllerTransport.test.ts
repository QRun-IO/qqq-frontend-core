/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {createServer, IncomingHttpHeaders, Server} from "http";
import {AddressInfo} from "net";
import FormData = require("form-data");
import {QController} from "../../src/controllers/QController";
import {QException} from "../../src/exceptions/QException";

require("jest-localstorage-mock");

describe("QController real HTTP transport", () =>
{
   let server: Server;
   let controller: QController;
   const requests: {path: string, method: string, headers: IncomingHttpHeaders, body: string}[] = [];

   beforeAll(async () =>
   {
      server = createServer((request, response) =>
      {
         const chunks: Buffer[] = [];
         request.on("data", (chunk: Buffer) => chunks.push(chunk));
         request.on("end", () =>
         {
            requests.push({path: request.url!, method: request.method!, headers: request.headers, body: Buffer.concat(chunks).toString("utf8")});
            response.setHeader("Content-Type", "application/json");
            if (request.url === "/metaData/authentication")
            {
               response.end(JSON.stringify({name: "owned-fixture", type: "MOCK"}));
            }
            else if (request.url === "/manageSession")
            {
               response.end(JSON.stringify({uuid: "fixture-session", values: {accepted: true}}));
            }
            else if (request.url === "/processes/upload%20fixture/init")
            {
               response.end(JSON.stringify({jobUUID: "fixture-job", processUUID: "fixture-process"}));
            }
            else
            {
               response.statusCode = 403;
               response.end(JSON.stringify({error: "Denied by owned fixture"}));
            }
         });
      });
      await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
      controller = new QController(`http://127.0.0.1:${(server.address() as AddressInfo).port}`);
      controller.getAxiosInstance().defaults.proxy = false;
      controller.setGotAuthentication();
   });

   beforeEach(() =>
   {
      requests.length = 0;
      localStorage.clear();
      QController.clearMemoization();
   });

   afterAll(async () =>
   {
      await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
   });

   it("fetches and caches provider metadata, then refreshes after cache eviction", async () =>
   {
      expect((await controller.getAuthenticationMetaData()).name).toBe("owned-fixture");
      expect((await controller.getAuthenticationMetaData()).type).toBe("MOCK");
      expect(requests).toHaveLength(1);
      controller.clearAuthenticationMetaDataLocalStorage();
      await controller.getAuthenticationMetaData();
      expect(requests.map(request => [request.method, request.path])).toEqual([
         ["GET", "/metaData/authentication"], ["GET", "/metaData/authentication"]
      ]);
   });

   it("posts session JSON without changing the supplied values", async () =>
   {
      expect(await controller.manageSession("fixture-access-token", "previous-session")).toEqual({uuid: "fixture-session", values: {accepted: true}});
      expect(requests[0].path).toBe("/manageSession");
      expect(requests[0].method).toBe("POST");
      expect(JSON.parse(requests[0].body)).toEqual({accessToken: "fixture-access-token", uuid: "previous-session"});
      expect(requests[0].headers["content-type"]).toContain("application/json");
   });

   it("sends multipart fields and file bytes with the declared boundary", async () =>
   {
      const data = new FormData();
      data.append("description", "Fixture café");
      data.append("file", Buffer.from("owned upload bytes"), {filename: "fixture.txt", contentType: "text/plain"});
      const result = await controller.processInit("upload fixture", data);
      expect(result).toMatchObject({jobUUID: "fixture-job", processUUID: "fixture-process"});
      expect(requests[0].method).toBe("POST");
      expect(requests[0].headers["content-type"]).toBe(`multipart/form-data; boundary=${data.getBoundary()}`);
      expect(requests[0].body).toContain(`--${data.getBoundary()}`);
      expect(requests[0].body).toContain("name=\"description\"");
      expect(requests[0].body).toContain("Fixture café");
      expect(requests[0].body).toContain("filename=\"fixture.txt\"");
      expect(requests[0].body).toContain("owned upload bytes");
   });

   it("surfaces a rejected server response without retrying the write", async () =>
   {
      await expect(controller.processInit("denied")).rejects.toBeInstanceOf(QException);
      expect(requests).toHaveLength(1);
      expect(requests[0].path).toBe("/processes/denied/init");
   });
});
