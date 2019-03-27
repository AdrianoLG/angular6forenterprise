import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InventoryRoutingModule } from './inventory-routing.module';
import { InventoryComponent } from './inventory.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StockEntryComponent } from './stock-entry/stock-entry.component';
import { ProductsComponent } from './products/products.component';
import { CategoriesComponent } from './categories/categories.component';
import { MaterialModule } from '../material.module';

@NgModule({
  declarations: [InventoryComponent, DashboardComponent, StockEntryComponent, ProductsComponent, CategoriesComponent],
  imports: [CommonModule, InventoryRoutingModule, MaterialModule]
})
export class InventoryModule {}
