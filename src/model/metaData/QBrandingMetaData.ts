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

import {Banner} from "./Banner";

/*******************************************************************************
 ** Meta-Data to define branding in a QQQ instance.
 **
 *******************************************************************************/
export class QBrandingMetaData
{
   companyName?: string;
   companyUrl?: string;
   appName?: string;
   logo?: string;
   icon?: string;
   accentColor?: string;
   accentColorLight?: string;
   gravatarDefault?: string;

   // Deprecated
   environmentBannerText?: string;

   // Deprecated
   environmentBannerColor?: string;

   banners?: Map<string, Banner>;

   constructor(object: any)
   {
      this.companyName = object.companyName;
      this.companyUrl = object.companyUrl;
      this.appName = object.appName;
      this.logo = object.logo;
      this.icon = object.icon;
      this.accentColor = object.accentColor;
      this.accentColorLight = object.accentColorLight;
      this.gravatarDefault = object.gravatarDefault;
      this.environmentBannerText = object.environmentBannerText;
      this.environmentBannerColor = object.environmentBannerColor;

      this.banners = new Map<string, Banner>();
      if(object.banners)
      {
         for (let i in object.banners)
         {
            this.banners.set(i, new Banner(object.banners[i]));
         }
      }
   }
}
