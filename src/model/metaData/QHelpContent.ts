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

      const clone = new QHelpContent({
         ...this,
         roles: rolesClone
      });
      return (clone);
   }

}
