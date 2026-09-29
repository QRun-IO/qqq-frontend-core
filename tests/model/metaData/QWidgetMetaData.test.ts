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

import {QWidgetMetaData} from "../../../src/model/metaData/QWidgetMetaData";

describe("QWidgetMetaData", () =>
{
   describe("constructor", () =>
   {
      it("should construct with collapsible object if set in source object", () =>
      {
         const widget = new QWidgetMetaData({
            name: "widget1",
            collapsible: {
               isCollapsible: true,
               initiallyOpen: false
            }
         });

         expect(widget.name).toBe("widget1");
         expect(widget.collapsible?.isCollapsible).toBe(true);
         expect(widget.collapsible?.initiallyOpen).toBe(false);
      });

      it("should construct with undefined collapsible object if not present in source object", () =>
      {
         const widget = new QWidgetMetaData({
            name: "widget2"
         });

         expect(widget.name).toBe("widget2");
         expect(widget.collapsible).toBeUndefined();
      });

      it("should construct with collapsible object with null values if empty collapsible object is in source", () =>
      {
         const widget = new QWidgetMetaData({
            name: "widget3",
            collapsible: {}
         });

         expect(widget.name).toBe("widget3");
         expect(widget.collapsible?.isCollapsible).toBe(false);
         expect(widget.collapsible?.initiallyOpen).toBe(false);
      });

   });

});
