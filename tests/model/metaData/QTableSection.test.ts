/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
 * 651 N Broad St Ste 205 # 6917 | Middletown DE 19709 | United States
 * contact@kingsrook.com
 * https://github.com/Kingsrook/
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
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
