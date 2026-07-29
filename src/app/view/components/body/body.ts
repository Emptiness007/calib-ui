import {ChangeDetectionStrategy, Component, inject, signal, computed} from '@angular/core';
import {ProductConfigService} from '../../../data/service/product-config.service';
import {EventsService} from '../../../data/service/events.service';
import {CalculationPage} from '../calculation-page/calculation-page';
import {ProductTreeComponent} from '../product-tree/product-tree.component';
import {PartData, ProductData} from '../../../data/model/product-data.interface';
import {TranslatePipe} from '@ngx-translate/core';

@Component({
  selector: 'app-body',
  imports: [
    CalculationPage,
    ProductTreeComponent,
    TranslatePipe
  ],
  templateUrl: './body.html',
  styleUrl: './body.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Body {
  private readonly productConfigService = inject(ProductConfigService);
  private readonly eventsService = inject(EventsService);

  products = signal<ProductData[]>([]);

  selectedPart = signal<PartData | null>(null);
  selectedProduct = signal<ProductData | null>(null);

  constructor() {
    this.loadProducts();
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

  selectPart(part: PartData, product: ProductData): void {
    this.selectedProduct.set(product);
    this.selectedPart.set(part);
  }
}
