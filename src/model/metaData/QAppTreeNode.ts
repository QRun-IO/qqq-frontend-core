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
