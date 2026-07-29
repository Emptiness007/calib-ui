import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { PartData, ProductData } from '../../../data/model/product-data.interface';

@Component({
  selector: 'app-product-tree',
  standalone: true,
  templateUrl: './product-tree.component.html',
  styleUrl: './product-tree.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductTreeComponent {
  products = input.required<ProductData[]>();
  selectedPartId = input<string | undefined>(undefined);

  partSelected = output<{ part: PartData, product: ProductData }>();

  expandedProducts = signal<Set<string>>(new Set());

  toggleProduct(productId: string): void {
    const current = this.expandedProducts();
    const newSet = new Set(current);
    if (newSet.has(productId)) {
      newSet.delete(productId);
    } else {
      newSet.add(productId);
    }
    this.expandedProducts.set(newSet);
  }

  isProductExpanded(productId: string): boolean {
    return this.expandedProducts().has(productId);
  }
}
