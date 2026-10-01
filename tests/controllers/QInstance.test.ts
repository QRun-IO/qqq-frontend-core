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

import {QInstance} from "../../src/model/metaData/QInstance";
import {QTableMetaData} from "../../src/model/metaData/QTableMetaData";
const fs = require("fs");

describe("q instance test", () =>
{
   it("should return table path", async () =>
   {
      const json = fs.readFileSync("./tests/mocks/metaData/index.json");
      const qInstance = new QInstance(JSON.parse(json));

      const table = new QTableMetaData({name: "person"});

      const tablePath = qInstance.getTablePath(table);
      expect(tablePath).toBe("/peopleApp/greetingsApp/person")
   });

});
