/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2022.  Kingsrook, LLC
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

import {QAppSection} from "./QAppSection";
import {QAppTreeNode} from "./QAppTreeNode";
import {QHelpContent} from "./QHelpContent";

/*******************************************************************************
 ** Meta-Data to define an app in a QQQ instance.
 **
 *******************************************************************************/
export class QAppMetaData
{
   name: string;
   label: string;
   children?: QAppTreeNode[];
   childMap?: Map<string, QAppTreeNode>;
   iconName?: string;
   widgets?: string[];
   sections?: QAppSection[];
   supplementalAppMetaData: Map<String, any> = new Map();
   helpContent?: Map<string, QHelpContent[]>;

   constructor(object: any)
   {
      this.name = object.name;
      this.label = object.label;
      this.iconName = object.iconName;
      this.widgets = object.widgets;

      if (object.children)
      {
         this.children = [];
         this.childMap = new Map<string, QAppTreeNode>;
         for (let i = 0; i < object.children.length; i++)
         {
            this.children.push(new QAppTreeNode(object.children[i]));
            this.childMap.set(object.children[i].name, object.children[i]);
         }
      }

      if (object.sections)
      {
         this.sections = [];
         for (let i = 0; i < object.sections.length; i++)
         {
            this.sections.push(new QAppSection(object.sections[i]));
         }
      }

      if (object.supplementalAppMetaData)
      {
         for (const key in object.supplementalAppMetaData)
         {
            this.supplementalAppMetaData.set(key, object.supplementalAppMetaData[key]);
         }
      }

      if (object.helpContents)
      {
         this.helpContent = QHelpContent.buildMap(object.helpContents);
      }
   }
}
