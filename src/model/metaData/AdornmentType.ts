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
 ** Possible data types for Q-fields.
 **
 *******************************************************************************/
export enum AdornmentType
{
   LINK = "LINK",
   CHIP = "CHIP",
   SIZE = "SIZE",
   ERROR = "ERROR",
   RENDER_HTML = "RENDER_HTML",
   REVEAL = "REVEAL",
   CODE_EDITOR = "CODE_EDITOR",
   FILE_DOWNLOAD = "FILE_DOWNLOAD",
   FILE_UPLOAD = "FILE_UPLOAD",
   TOOLTIP = "TOOLTIP",
   WIDGET = "WIDGET",
   ///////////////////////////////////////////////////////////////////////////
   // keep these values in sync with AdornmentType.java in qqq-backend-core //
   ///////////////////////////////////////////////////////////////////////////
}
