import {inject, Injectable} from '@angular/core';
import {Observable, tap} from 'rxjs';
import {ProductDataConfig, ProductData, PartData} from '../model/product-data.interface';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductConfigService {
  private readonly http = inject(HttpClient);

  private config: ProductDataConfig | null = null;

  // Загрузка конфигурации из файла
  loadConfig(): Observable<ProductDataConfig> {
    return this.http.get<ProductDataConfig>('/public/config/product-data.json').pipe(
      tap(cfg => {
        this.config = cfg;
      })
    );
  }

  getConfig(){
    return this.config;
  }
  // Обновить продукт
  updateProduct(productId: string, data: Partial<ProductData>): Observable<any> {
    return this.http.put(`/api/config/products/${productId}`, data);
  }

  // Обновить часть продукта
  updatePart(productId: string, partId: string, data: Partial<PartData>): Observable<any> {
    return this.http.put(`/api/config/products/${productId}/parts/${partId}`, data);
  }

  // Добавить часть в продукт
  addPartToProduct(productId: string, part: PartData): Observable<any> {
    return this.http.post(`/api/config/products/${productId}/parts`, part);
  }

  // Добавить новый продукт
  addProduct(product: {nameFull: string, parts?: PartData[]}): Observable<any> {
    return this.http.post(`/api/config/products`, product);
  }

  // Удалить продукт
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(`/api/config/products/${productId}`);
  }

  // Удалить часть из продукта
  deletePartFromProduct(productId: string, partId: string): Observable<any> {
    return this.http.delete(`/api/config/products/${productId}/parts/${partId}`);
  }
}
