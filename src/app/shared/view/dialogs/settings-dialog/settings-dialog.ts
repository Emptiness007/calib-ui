import {ChangeDetectionStrategy, Component, inject, signal} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ProductConfigService} from '../../../../data/service/product-config.service';
import {ProductData, PartData, HeightConstants} from '../../../../data/model/product-data.interface';
import {KeyValuePipe, CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';

type EntityType = 'product' | 'part' | 'create-product' | 'create-part' | 'none';

@Component({
  selector: 'app-settings-dialog',
  imports: [
    TranslatePipe,
    KeyValuePipe,
    ReactiveFormsModule,
    CommonModule
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
  
  // Navigation State
  selectedEntityType = signal<EntityType>('none');
  selectedProduct = signal<ProductData | null>(null);
  selectedPart = signal<PartData | null>(null);
  expandedProducts = signal<Set<string>>(new Set());

  // Forms
  productForm: FormGroup;
  partForm: FormGroup;
  addStageForm: FormGroup;

  // Edit Stage State
  editingStageKey = signal<string | null>(null);
  editA1 = signal<number | null>(null);
  editA2 = signal<number | null>(null);

  constructor() {
    this.productForm = this.fb.group({
      nameFull: ['', Validators.required]
    });

    this.partForm = this.fb.group({
      nameDisplay: ['', Validators.required],
      tolerance: [null, Validators.required],
      hSet: [null, Validators.required],
      hMeasured: [null, Validators.required],
      protocol: ['', Validators.required]
    });

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
      
      // Reselect after load to maintain state
      if (currentProduct) {
        const prod = config.product.find(p => p.id === currentProduct.id);
        if (prod) {
          this.selectedProduct.set(prod);
          if (this.selectedEntityType() === 'product') {
             this.productForm.patchValue({ nameFull: prod.nameFull });
          }
          if (currentPart) {
            const pt = prod.parts.find(p => p.id === currentPart.id);
            if (pt) {
               this.selectedPart.set(pt);
               if (this.selectedEntityType() === 'part') {
                  this.patchPartForm(pt);
               }
            } else if (this.selectedEntityType() === 'part') {
               this.selectProduct(prod);
            }
          }
        } else {
          this.resetSelection();
        }
      }
    });
  }

  // --- Navigation & Selection ---

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

  selectProduct(product: ProductData): void {
    this.selectedProduct.set(product);
    this.selectedPart.set(null);
    this.selectedEntityType.set('product');
    this.productForm.patchValue({ nameFull: product.nameFull });
    
    // Automatically expand the product when selected
    const current = this.expandedProducts();
    if (!current.has(product.id)) {
      this.toggleProduct(product.id);
    }
  }

  selectPart(product: ProductData, part: PartData): void {
    this.selectedProduct.set(product);
    this.selectedPart.set(part);
    this.selectedEntityType.set('part');
    this.patchPartForm(part);
    this.cancelEdit();
    this.addStageForm.reset();
  }

  private patchPartForm(part: PartData): void {
    this.partForm.patchValue({
      nameDisplay: part.nameDisplay,
      tolerance: part.tolerance,
      hSet: part.physicalConstants?.hSet,
      hMeasured: part.physicalConstants?.hMeasured,
      protocol: part.physicalConstants?.protocol
    });
  }

  resetSelection(): void {
    this.selectedProduct.set(null);
    this.selectedPart.set(null);
    this.selectedEntityType.set('none');
  }

  // --- Product CRUD ---

  startCreateProduct(): void {
    this.resetSelection();
    this.selectedEntityType.set('create-product');
    this.productForm.reset();
  }

  saveProduct(): void {
    if (this.productForm.invalid) return;
    
    const { nameFull } = this.productForm.value;
    const currentProduct = this.selectedProduct();

    if (this.selectedEntityType() === 'create-product') {
      this.productConfigService.addProduct({ nameFull, parts: [] }).subscribe((res) => {
        this.selectProduct(res.product);
        this.loadConfig();
      });
    } else if (currentProduct) {
      this.productConfigService.updateProduct(currentProduct.id, { nameFull }).subscribe(() => {
        this.loadConfig();
      });
    }
  }

  deleteProduct(): void {
    const currentProduct = this.selectedProduct();
    if (!currentProduct) return;
    
    if (confirm(`Вы уверены, что хотите удалить изделие "${currentProduct.nameFull}" и все его детали?`)) {
      this.productConfigService.deleteProduct(currentProduct.id).subscribe(() => {
        this.resetSelection();
        this.loadConfig();
      });
    }
  }

  // --- Part CRUD ---

  startCreatePart(): void {
    if (!this.selectedProduct()) return;
    this.selectedPart.set(null);
    this.selectedEntityType.set('create-part');
    this.partForm.reset();
  }

  savePart(): void {
    if (this.partForm.invalid) return;

    const product = this.selectedProduct();
    if (!product) return;

    const formVal = this.partForm.value;
    const partData: any = {
      nameDisplay: formVal.nameDisplay,
      tolerance: Number(formVal.tolerance),
      physicalConstants: {
        hSet: Number(formVal.hSet),
        hMeasured: Number(formVal.hMeasured),
        protocol: formVal.protocol
      }
    };

    if (this.selectedEntityType() === 'create-part') {
      partData.stages = {};
      this.productConfigService.addPartToProduct(product.id, partData).subscribe((res) => {
        this.selectPart(product, res.part);
        this.loadConfig();
      });
    } else {
      const part = this.selectedPart();
      if (part) {
        this.productConfigService.updatePart(product.id, part.id, partData).subscribe(() => {
          this.loadConfig();
        });
      }
    }
  }

  deletePart(): void {
    const product = this.selectedProduct();
    const part = this.selectedPart();
    if (!product || !part) return;

    if (confirm(`Вы уверены, что хотите удалить деталь "${part.nameDisplay}"?`)) {
      this.productConfigService.deletePartFromProduct(product.id, part.id).subscribe(() => {
        this.selectProduct(product); // Go back to product view
        this.loadConfig();
      });
    }
  }

  // --- Stages CRUD (Existing logic) ---

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
