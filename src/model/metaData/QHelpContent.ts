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

/*******************************************************************************
 ** Meta-Data to define HelpContent
 **
 *******************************************************************************/
export class QHelpContent
{
   content: string;
   format: string;
   roles = new Set<string>();


   /*******************************************************************************
    **
    *******************************************************************************/
   constructor(object: any)
   {
      this.content = object.content;
      this.format = object.format;

      if (object.roles)
      {
         for (let i = 0; i < object.roles.length; i++)
         {
            this.roles.add(object.roles[i]);
         }
      }
   }


   /*******************************************************************************
    ** factory method, for building an array of QHelpContent objects from array of
    ** unstructured data (e.g., as it would come from the backend)
    *******************************************************************************/
   static buildArray(helpContents: any[]): QHelpContent[] | undefined
   {
      let rs: QHelpContent[] | undefined;

      if (helpContents)
      {
         rs = [];
         for (let i = 0; i < helpContents.length; i++)
         {
            rs.push(new QHelpContent(helpContents[i]));
         }
      }

      return (rs);
   }


   /*******************************************************************************
    ** factory method, for building an map of QHelpContent objects from map of
    ** unstructured data (e.g., as it would come from the backend)
    *******************************************************************************/
   static buildMap(object: any): Map<string, QHelpContent[]> | undefined
   {
      let rs = undefined;

      if (object)
      {
         rs = new Map<string, QHelpContent[]>();
         for (const key in object)
         {
            const list: QHelpContent[] = [];
            rs.set(key, list);

            //////////////////////////////////////////////////////////////////////////////////////////////////////
            // allow object from backend to either be an array or a scalar (for migration from scalar to array) //
            //////////////////////////////////////////////////////////////////////////////////////////////////////
            if (object[key].length)
            {
               for (let i = 0; i < object[key].length; i++)
               {
                  list.push(new QHelpContent(object[key][i]));
               }
            }
            else
            {
               list.push(new QHelpContent(object[key]));
            }
         }
      }

      return (rs);
   }


   /***************************************************************************
    *
    ***************************************************************************/
   public clone(): QHelpContent
   {
      const rolesClone = new Set<string>();
      this.roles.forEach((role) =>
      {
         rolesClone.add(role);
      });

      const clone = new QHelpContent({...this});

      ////////////////////////////////////////////////////////////////////////////////
      // sets don't quite work as expected for this kind of clone, so copy manually //
      ////////////////////////////////////////////////////////////////////////////////
      clone.roles = rolesClone;

      return (clone);
   }

}
