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

import {QAppNodeType} from "./QAppNodeType";
import {QIcon} from "./QIcon";

/*******************************************************************************
 ** Meta-Data to define an object that is part of the app-hierarchy/tree.
 ** e.g., Tables, Processes, and Apps themselves (since they can be nested).
 **
 *******************************************************************************/
export class QAppTreeNode
{
   name: string;
   label: string;
   type: QAppNodeType;
   children?: QAppTreeNode[];
   hideChildrenFromNavigation?: boolean;
   iconName?: string;
   icon?: QIcon;
   appAffinity?: number;

   constructor(object: any)
   {
      this.name = object.name;
      this.label = object.label;
      this.type = object.type;
      this.iconName = object.iconName;
      this.appAffinity = object.appAffinity;
      this.hideChildrenFromNavigation = object.hideChildrenFromNavigation;

      if (object.icon)
      {
         this.icon = new QIcon(object.icon);
      }

      if (object.children)
      {
         this.children = [];
         for (let i = 0; i < object.children.length; i++)
         {
            this.children.push(new QAppTreeNode(object.children[i]));
         }
      }
   }

}
