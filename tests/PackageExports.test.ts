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

import {QController, QFieldMetaData, QFieldType, QTableMetaData} from "../src/qqq-frontend-core";

describe("public package exports", () =>
{
   it("exposes the controller and metadata constructors", () =>
   {
      expect(typeof QController).toBe("function");
      expect(typeof QTableMetaData).toBe("function");
      expect(new QFieldMetaData({name: "id", type: QFieldType.INTEGER}).name).toBe("id");
      expect(QFieldType.INTEGER).toBeDefined();
   });
});
