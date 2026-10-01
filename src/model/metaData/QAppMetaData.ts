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
