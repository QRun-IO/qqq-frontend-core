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
 ** Things that can be done to tables, fields.
 **
 *******************************************************************************/
export enum Capability
{
   TABLE_QUERY = "TABLE_QUERY",
   TABLE_GET = "TABLE_GET",
   TABLE_COUNT = "TABLE_COUNT",
   TABLE_INSERT = "TABLE_INSERT",
   TABLE_UPDATE = "TABLE_UPDATE",
   TABLE_DELETE = "TABLE_DELETE",
   TABLE_EXPORT = "TABLE_EXPORT"
   ////////////////////////////////////////////////////////////////////////
   // keep these values in sync with Capability.java in qqq-backend-core //
   ////////////////////////////////////////////////////////////////////////
}
