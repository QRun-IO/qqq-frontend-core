/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
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

import {QTableSection} from "../../../src/model/metaData/QTableSection";

describe("QTableSection", () =>
{
   describe("constructor", () =>
   {
      it("should construct with collapsible object if set in source object", () =>
      {
         const section = new QTableSection({
            name: "section1",
            collapsible: {
               isCollapsible: true,
               initiallyOpen: false
            }
         });

         expect(section.name).toBe("section1");
         expect(section.collapsible?.isCollapsible).toBe(true);
         expect(section.collapsible?.initiallyOpen).toBe(false);
      });

      it("should construct with undefined collapsible object if not present in source object", () =>
      {
         const section = new QTableSection({
            name: "section2"
         });

         expect(section.name).toBe("section2");
         expect(section.collapsible).toBeUndefined();
      });

      it("should construct with collapsible object with null values if empty collapsible object is in source", () =>
      {
         const section = new QTableSection({
            name: "section3",
            collapsible: {}
         });

         expect(section.name).toBe("section3");
         expect(section.collapsible?.isCollapsible).toBe(false);
         expect(section.collapsible?.initiallyOpen).toBe(false);
      });

      it("should deeply clone a collapsible", () =>
      {
         const section = new QTableSection({
            name: "section4",
            collapsible: {
               isCollapsible: true,
               initiallyOpen: true
            }
         });

         expect(section.name).toBe("section4");
         expect(section.collapsible?.isCollapsible).toBe(true);
         expect(section.collapsible?.initiallyOpen).toBe(true);

         const clone = section.clone();
         expect(clone.collapsible?.isCollapsible).toBe(true);
         expect(clone.collapsible?.initiallyOpen).toBe(true);

         if(clone.collapsible)
         {
            clone.collapsible.initiallyOpen = false;
         }
         expect(section.collapsible?.initiallyOpen).toBe(true);
         expect(clone.collapsible?.initiallyOpen).toBe(false);
      });

      it("should handle an undefined collapsible during cloning", () =>
      {
         const section = new QTableSection({
            name: "section5"
         });

         expect(section.name).toBe("section5");
         expect(section.collapsible).toBeUndefined();

         const clone = section.clone();
         expect(clone.collapsible).toBeUndefined();
      });
   });

});
