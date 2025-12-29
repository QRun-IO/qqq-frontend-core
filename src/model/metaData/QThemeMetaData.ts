/*
 * QQQ - Low-code Application Framework for Engineers.
 * Copyright (C) 2021-2025.  Kingsrook, LLC
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
 ** Meta-Data to define theme configuration in a QQQ instance.
 **
 *******************************************************************************/
export class QThemeMetaData
{
   // Color palette
   primaryColor?: string;
   secondaryColor?: string;
   backgroundColor?: string;
   surfaceColor?: string;
   textPrimary?: string;
   textSecondary?: string;
   errorColor?: string;
   warningColor?: string;
   successColor?: string;
   infoColor?: string;

   // Typography
   fontFamily?: string;
   headerFontFamily?: string;

   // Sizing
   borderRadius?: string;
   density?: "compact" | "normal" | "comfortable";

   // Asset paths
   logoPath?: string;
   iconPath?: string;
   faviconPath?: string;

   // Custom CSS
   customCss?: string;

   constructor(object: any)
   {
      this.primaryColor = object.primaryColor;
      this.secondaryColor = object.secondaryColor;
      this.backgroundColor = object.backgroundColor;
      this.surfaceColor = object.surfaceColor;
      this.textPrimary = object.textPrimary;
      this.textSecondary = object.textSecondary;
      this.errorColor = object.errorColor;
      this.warningColor = object.warningColor;
      this.successColor = object.successColor;
      this.infoColor = object.infoColor;
      this.fontFamily = object.fontFamily;
      this.headerFontFamily = object.headerFontFamily;
      this.borderRadius = object.borderRadius;
      this.density = object.density;
      this.logoPath = object.logoPath;
      this.iconPath = object.iconPath;
      this.faviconPath = object.faviconPath;
      this.customCss = object.customCss;
   }
}
