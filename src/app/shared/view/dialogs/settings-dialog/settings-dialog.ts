import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductConfigService} from '../../../../data/service/product-config.service';
import {ProductData, PartData, HeightConstants} from '../../../../data/model/product-data.interface';
import {ProductTreeComponent} from '../../../../view/components/product-tree/product-tree.component';
import {KeyValuePipe} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    TranslatePipe,
    ProductTreeComponent,
    KeyValuePipe,
    ReactiveFormsModule
  ],
  templateUrl: './settings-dialog.html',
  styleUrl: './settings-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsDialog {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly productConfigService = inject(ProductConfigService);
  private readonly fb = inject(FormBuilder);

  products = signal<ProductData[]>([]);
  selectedProduct = signal<ProductData | null>(null);
  selectedPart = signal<PartData | null>(null);

  editingStageKey = signal<string | null>(null);
  editA1 = signal<number | null>(null);
  editA2 = signal<number | null>(null);

  addStageForm: FormGroup;

  constructor() {
    this.addStageForm = this.fb.group({
      stageName: ['', Validators.required],
      a1: [null, Validators.required],
      a2: [null, Validators.required]
    });
    this.loadConfig();
  }

  private loadConfig(): void {
    this.productConfigService.loadConfig().subscribe(config => {
      this.products.set(config.product);
      
      const currentProduct = this.selectedProduct();
      const currentPart = this.selectedPart();
      if (currentProduct && currentPart) {
        const prod = config.product.find(p => p.id === currentProduct.id);
        if (prod) {
          const pt = prod.parts.find(p => p.id === currentPart.id);
          if (pt) {
             this.selectedPart.set(pt);
             this.selectedProduct.set(prod);
          }
        }
      }
    });
  }

  onPartSelect(event: {part: PartData, product: ProductData}): void {
    this.selectedProduct.set(event.product);
    this.selectedPart.set(event.part);
    this.cancelEdit();
    this.addStageForm.reset();
  }

  startEdit(stageKey: string, currentA1: number, currentA2: number): void {
    this.editingStageKey.set(stageKey);
    this.editA1.set(currentA1);
    this.editA2.set(currentA2);
  }

  cancelEdit(): void {
    this.editingStageKey.set(null);
    this.editA1.set(null);
    this.editA2.set(null);
  }

  saveEdit(stageKey: string): void {
    const product = this.selectedProduct();
    const part = this.selectedPart();
    if (!product || !part) return;

    const a1 = this.editA1();
    const a2 = this.editA2();

    if (a1 === null || a2 === null) return;

    const updatedStages = { ...part.stages, [stageKey]: { a1, a2 } };
    
    this.productConfigService.updatePart(product.id, part.id, { stages: updatedStages })
      .subscribe(() => {
        this.editingStageKey.set(null);
        this.loadConfig();
      });
  }

  deleteStage(stageKey: string): void {
    const product = this.selectedProduct();
    const part = this.selectedPart();
    if (!product || !part) return;

    const currentStages = { ...part.stages };
    delete currentStages[stageKey];

    this.productConfigService.updatePart(product.id, part.id, { stages: currentStages })
      .subscribe(() => {
        if (this.editingStageKey() === stageKey) {
          this.cancelEdit();
        }
        this.loadConfig();
      });
  }

  addStage(): void {
    if (this.addStageForm.invalid) return;

    const product = this.selectedProduct();
    const part = this.selectedPart();
    
    if (!product || !part) return;

    const { stageName, a1, a2 } = this.addStageForm.value;
    const updatedStages = { ...part.stages, [stageName]: { a1: Number(a1), a2: Number(a2) } };
    
    this.productConfigService.updatePart(product.id, part.id, { stages: updatedStages })
      .subscribe(() => {
        this.addStageForm.reset();
        this.loadConfig();
      });
  }

  onClose() {
    this.activeModal.close();
  }
}
