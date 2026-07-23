import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {ProductConfigService} from '../../../data/service/product-config.service';
import {EventsService} from '../../../data/service/events.service';
import {CalculationPage} from '../calculation-page/calculation-page';
import {PartData, ProductData} from '../../../data/model/product-data.interface';

@Component({
  selector: 'app-body',
  imports: [
    CalculationPage
  ],
  templateUrl: './body.html',
  styleUrl: './body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Body {
  private readonly productConfigService = inject(ProductConfigService);
  private readonly eventsService = inject(EventsService);

  products = signal<ProductData[]>([]);
  expandedProducts = signal<Set<string>>(new Set());

  selectedPart = signal<PartData | null>(null);
  selectedProductId = signal<string>('');

  constructor() {
    this.loadProducts();
  }

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

  private loadProducts(): void {
    this.productConfigService.loadConfig().subscribe({
      next: (config) => {
        this.products.set(config.product);
      },
      error: (error) => {
        console.error('Failed to load config:', error);
      }
    });
  }

  selectPart(part: PartData, productId: string): void {
    this.selectedProductId.set(productId);
    this.selectedPart.set(part);
  }
}
