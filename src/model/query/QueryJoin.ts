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
 ** Define a QueryJoin, as part of a query input
 **
 *******************************************************************************/
export class QueryJoin
{
   joinTable: string;
   select: boolean;
   type: "INNER" | "LEFT" | "RIGHT" | "FULL";
   baseTableOrAlias: string | null;
   alias: string | null;
   joinName: string | null;

   constructor(
      joinTable: string,
      select: boolean = false,
      type: "INNER" | "LEFT" | "RIGHT" | "FULL" = "INNER",
      baseTableOrAlias: string | null = null,
      alias: string | null = null,
      joinName: string | null = null
   )
   {
      this.joinTable = joinTable;
      this.select = select;
      this.type = type;
      this.baseTableOrAlias = baseTableOrAlias;
      this.alias = alias;
      this.joinName = joinName;
   }
}
