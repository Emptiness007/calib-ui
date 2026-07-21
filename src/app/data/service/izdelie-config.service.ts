import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {environment} from '../../../environments/environment';
import {IzdelieDataConfig, IzdelieSection, IzdelieConfigData} from '../model/izdelie-data.interface';

@Injectable({
  providedIn: 'root'
})
export class IzdelieConfigService {
  private readonly http = inject(HttpClient);

  private config: IzdelieDataConfig | null = null;
  private configLoaded = false;

  // Загрузка конфигурации
  loadConfig(): Observable<IzdelieDataConfig> {
    const url = '/api/config/izdelie';

    return this.http.get<IzdelieDataConfig>(url).pipe(
      tap(cfg => {
        this.config = cfg;
        this.configLoaded = true;
      })
    );
  }

  // Получить всю конфигурацию
  getConfig(): IzdelieDataConfig | null {
    return this.config;
  }

  // Проверка загруженности
  isConfigLoaded(): boolean {
    return this.configLoaded;
  }

  // Получить все разделы
  getSections(): IzdelieSection[] {
    return this.config?.sections ?? [];
  }

  // Получить раздел по ID
  getSectionById(sectionId: string): IzdelieSection | undefined {
    return this.config?.sections.find(s => s.id === sectionId);
  }

  // Получить раздел по полному имени
  getSectionByNameFull(nameFull: string): IzdelieSection | undefined {
    return this.config?.sections.find(s => s.nameFull === nameFull);
  }

  // Получить все изделия из раздела
  getIzdeliesBySection(sectionId: string): IzdelieConfigData[] {
    const section = this.getSectionById(sectionId);
    return section?.izdelies ?? [];
  }

  // Получить изделие по ID
  getIzdelieById(izdelieId: string): IzdelieConfigData | undefined {
    return this.config?.sections.flatMap(s => s.izdelies).find(i => i.id === izdelieId);
  }

  // Получить все изделия (из всех разделов)
  getAllIzdelies(): IzdelieConfigData[] {
    return this.config?.sections.flatMap(s => s.izdelies) ?? [];
  }

  // Проверить, является ли ступень специальной
  isSpecialStage(izdelieId: string, stageNumber: number): boolean {
    const izdelie = this.getIzdelieById(izdelieId);
    return izdelie?.specialStages.includes(stageNumber) ?? false;
  }

  // Получить разделы с количеством изделий
  getSectionsWithCount(): {section: IzdelieSection, count: number}[] {
    return this.config?.sections.map(s => ({
      section: s,
      count: s.izdelies.length
    })) ?? [];
  }

  // Обновить раздел
  updateSection(sectionId: string, data: Partial<IzdelieSection>): Observable<any> {
    return this.http.put(`/api/config/izdelie/sections/${sectionId}`, data);
  }

  // Обновить изделие
  updateIzdelie(sectionId: string, izdelieId: string, data: Partial<IzdelieConfigData>): Observable<any> {
    return this.http.put(`/api/config/izdelie/sections/${sectionId}/izdelies/${izdelieId}`, data);
  }

  // Добавить изделие в раздел
  addIzdelieToSection(sectionId: string, izdelie: IzdelieConfigData): Observable<any> {
    return this.http.post(`/api/config/izdelie/sections/${sectionId}/izdelies`, izdelie);
  }

  // Добавить новый раздел
  addSection(section: {nameShort: string, nameFull: string, izdelies?: IzdelieConfigData[]}): Observable<any> {
    return this.http.post(`/api/config/izdelie/sections`, section);
  }

  // Удалить раздел
  deleteSection(sectionId: string): Observable<any> {
    return this.http.delete(`/api/config/izdelie/sections/${sectionId}`);
  }

  // Удалить изделие из раздела
  deleteIzdelieFromSection(sectionId: string, izdelieId: string): Observable<any> {
    return this.http.delete(`/api/config/izdelie/sections/${sectionId}/izdelies/${izdelieId}`);
  }
}
